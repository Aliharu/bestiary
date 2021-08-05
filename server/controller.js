let { updateHewyRating } = require('./HewyRater')
let rollDice = function (diceString) {
  if (typeof (diceString) === 'number') {
    return +Math.floor(Math.random() * Math.floor(diceString)) + 1
  } else {
    let diceExpressionArray = []
    let expressionValue = ""

    diceString.replace(/\s/g, '').split('').forEach((val, i, array) => {
      if (val === '-' || val === '+' || val === '*') {
        diceExpressionArray.push(expressionValue)
        if (i !== array.length - 1) {
          diceExpressionArray.push(val)
        }
        expressionValue = ""
      }
      if (!isNaN(+val) || val === 'd' || val === "!") {
        val = val.replace(/!/i, "")
        expressionValue = expressionValue + val;
      }

      if (i === array.length - 1 && expressionValue !== '') {
        diceExpressionArray.push(expressionValue);
      }
    })
    
    for (let index = 0; index < diceExpressionArray.length; index++) {
      let val = diceExpressionArray[index];

      if (val.includes('d')) {
        val = val.split('d')
        let subtotal = 0
        if (val[0] === "") {val[0] = 1}
        for (let i = 0; i < +val[0]; i++) {
          subtotal += rollDice(+val[1])
        }
        diceExpressionArray[index] = subtotal
      }
    }
    
    return eval(diceExpressionArray.join(""))
  }
}

let controllerObj = {
  catalogCache: [],
  newCache: [],
  createHash() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 10; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },
  collectCache(app, index) {
    const db = app.get('db')
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    if (alphabet[index]) {
      db.get.catalogbyletter(alphabet[index]).then(result => {
        if (result.length > 0) {
          this.newCache.push(result)
        }
        this.collectCache(app, ++index)
      })
    } else {
      this.catalogCache = this.newCache
      this.newCache = []
      console.log('catalog collected')
    }
  },
  // BEAST ENDPOINTS
  checkIfPlayerView(req, res) {
    const db = req.app.get('db')
      , id = +req.params.id

    db.get.playercanview(id).then(result => {
      res.send(result[0])
    })
  },
  getFromBestiary(req, res) {
    const db = req.app.get('db')
    db.get.beast_by_hash(req.params.hash).then(roughBeast => {
      roughBeast = roughBeast[0]
      let beast = {
        name: roughBeast.name,
        trauma: Math.floor(rollDice(roughBeast.vitality) / 2),
        weapons: []
      }
      let finalPromise = [];
      finalPromise.push(db.get.beastcombat(roughBeast.id).then(result => {
        result.forEach(val => {
          beast.weapons.push({
            weaponid: val.id,
            name: val.weapon,
            recovery: val.spd
          })
        })
        if (beast.weapons[0]) {
          beast.recovery = beast.weapons[0].recovery
          beast.selectedId = beast.weapons[0].weaponid
        }
      }))
      Promise.all(finalPromise).then(actualFinal => {
        if (beast.name && beast.recovery) {
          res.send(beast)
        } else {
          res.send({ message: "This hash doesn't belong to a valid monster", color: 'red' })
        }
      })
    })
  },
  getPlayerBeast(req, res) {
    const db = req.app.get('db')
      , id = +req.params.id
    db.get.playerVersion(id).then(result => {
      if (req.user) {
        db.get.beastnotes(id, req.user.id).then(notes => {
          result = result[0]
          result.notes = notes[0] || {}
          res.send(result)
        })
      } else {
        res.send(result)
      }
    })
  },
  addPlayerNotes(req, res) {
    const db = req.app.get('db')
      , { beastId, noteId, notes } = req.body

    if (req.user) {
      if (noteId) {
        db.update.beastnotes(noteId, notes).then(result => {
          res.send(result[0])
        })
      } else {
        db.get.usernotecount(req.user.id).then(count => {
          count = count[0]
          if (count >= 5 || count >= req.user.patreon * 10) {
            res.status(401).send('You need to upgrade your Patreon to add more notes')
          } else {
            db.add.beastnotes(beastId, req.user.id, notes).then(result => {
              res.send(result[0])
            })
          }
        })
      }
    } else {
      res.sendStatus(401)
    }
  },
  addBeast({ body, app }, res) {
    const db = app.get('db')
    let { name, hr, intro, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, stress, types, environ, combat, movement, conflict, skills, int, variants, loot, reagents, lootnotes, traitlimit, devotionlimit, flawlimit, passionlimit, encounter, plural, thumbnail, rarity, locationalvitality, lairloot } = body

    db.add.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, +subsystem, +patreon, vitality, +panic, +stress, +int, controllerObj.createHash(), lootnotes, +traitlimit > 0 ? +traitlimit : null, +devotionlimit > 0 ? +devotionlimit : null, +flawlimit > 0 ? +flawlimit : null, +passionlimit > 0 ? +passionlimit : null, plural, thumbnail, rarity).then(result => {
      let id = result[0].id
        , promiseArray = []

      types.forEach(val => {
        promiseArray.push(db.add.beasttype(id, val.typeid).then())
      })
      environ.forEach(val => {
        promiseArray.push(db.add.beastenviron(id, val.environid).then())
      })
      combat.forEach(({ spd, atk, init, def, dr, shield_dr, measure, damage, parry, fatigue, weapon, weapontype, ranges }) => {
        promiseArray.push(db.add.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, fatigue, weapon, weapontype).then(result => {
          if (weapontype === 'r') {
            return db.add.combatranges(result[0].id, +ranges.thirtytwo).then()
          }
          return true;
        }))
      })
      let newConflict = []
      Object.keys(conflict).forEach(key => newConflict = [...newConflict, ...conflict[key]])
      newConflict.forEach(({ trait, value, type }) => {
        promiseArray.push(db.add.beastconflict(id, trait, value, type).then())
      })
      skills.forEach(({ skill, rank }) => {
        promiseArray.push(db.add.beastskill(id, skill, rank).then())
      })
      movement.forEach(({ stroll, walk, jog, run, sprint, type }) => {
        promiseArray.push(db.add.beastmovement(id, stroll, walk, jog, run, sprint, type).then())
      })
      variants.forEach(({ variantid }) => {
        promiseArray.push(db.add.beastvariants(id, variantid).then())
        promiseArray.push(db.add.beastvariants(variantid, id).then())
      })
      loot.forEach(({ loot, price }) => {
        promiseArray.push(db.add.beastloot(id, loot, price).then())
      })
      reagents.forEach(({ name, spell, difficulty, harvest }) => {
        promiseArray.push(db.add.beastreagents(id, name, spell, difficulty, harvest).then())
      })

      let { temperament } = encounter;
      temperament.temperament.forEach(({ temperament: temp, weight, id: tempid, beastid, tooltip, deleted, temperamentid }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.temperament(beastid, tempid))
        } else if ((temperamentid && !beastid) || (temperamentid && beastid !== id)) {
          promiseArray.push(db.add.encounter.temperament(id, temperamentid, weight))
        } else if (temperamentid && beastid) {
          promiseArray.push(db.update.encounter.temperament(weight, beastid, temperamentid))
        } else if (!temperamentid) {
          db.add.encounter.allTemp(temp, tooltip).then(result => {
            promiseArray.push(db.add.encounter.temperament(id, result[0].id, weight))
          })
        }
      })

      let { rank } = encounter;
      rank.rank.forEach(({ rank: rank, weight, id: rankid, beastid, lair, othertypechance, decayrate, deleted, number }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.rank(beastid, rankid))
        } else if ((rankid && !beastid) || (rankid && beastid !== id)) {
          promiseArray.push(db.add.encounter.rank(rankid, id, weight, othertypechance, decayrate, lair, number))
        } else if (rankid && beastid) {
          promiseArray.push(db.update.encounter.rank(rankid, id, weight, othertypechance, decayrate, lair, number))
        } else if (!rankid) {
          db.add.encounter.allRank(rank).then(result => {
            promiseArray.push(db.add.encounter.rank(result[0].id, id, weight, othertypechance, decayrate, lair, number))
          })
        }
      })

      let { verb } = encounter;
      verb.verb.forEach(({ verb, id: verbid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.verb(beastid, verbid))
        } else if ((verbid && !beastid) || (verbid && beastid !== id)) {
          promiseArray.push(db.add.encounter.verb(verbid, id))
        } else if (!verbid) {
          db.add.encounter.allVerb(verb).then(result => {
            promiseArray.push(db.add.encounter.verb(result[0].id, id))
          })
        }
      })

      locationalvitality.forEach(({ id: locationid, location, vitality, beastid }) => {
        if (deleted) {
          promiseArray.push(db.delete.locationalvitality(beastid, locationid))
        } else if (locationid && beastid) {
          promiseArray.push(db.update.locationalvitality(beastid, location, vitality, locationid))
        } else {
          promiseArray.push(db.add.locationalvitality(beastid, locationid, vitality))
        }
      })

      let { noun } = encounter;
      noun.noun.forEach(({ noun, id: nounid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.noun(beastid, nounid))
        } else if ((nounid && !beastid) || (nounid && beastid !== id)) {
          promiseArray.push(db.add.encounter.noun(nounid, id))
        } else if (!nounid) {
          db.add.encounter.allNoun(noun).then(result => {
            promiseArray.push(db.add.encounter.noun(result[0].id, id))
          })
        }
      })

      let { beastid, copper, silver, gold, potion, relic, enchanted, equipment, traited, scrolls, alms } = lairloot
      if (!beastid) {
        promiseArray.push(db.add.loot.basic(id, copper, silver, gold, potion, relic, enchanted))
      } else {
        promiseArray.push(db.update.loot.basic(beastid, copper, silver, gold, potion, relic, enchanted))
      }

      equipment.forEach(({ id: equipid, beastid, value, number, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.equipment(beastid, equipid))
        } else if (equipid && beastid) {
          promiseArray.push(db.update.loot.equipment(equipid, value, number))
        } else {
          promiseArray.push(db.add.loot.equipment(id, value, number))
        }
      })

      traited.forEach(({ id: traitedid, beastid, value, chancetable, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.traited(beastid, traitedid))
        } else if (traitedid && beastid) {
          promiseArray.push(db.update.loot.traited(traitedid, value, chancetable))
        } else {
          promiseArray.push(db.add.loot.traited(id, value, chancetable))
        }
      })

      scrolls.forEach(({ id: scrollid, beastid, number, power, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.scrolls(beastid, scrollid))
        } else if (scrollid && beastid) {
          promiseArray.push(db.update.loot.scrolls(scrollid, number, power))
        } else {
          promiseArray.push(db.add.loot.scrolls(id, number, power))
        }
      })

      alms.forEach(({ id: almid, beastid, number, favor, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.alms(beastid, almid))
        } else if (almid && beastid) {
          promiseArray.push(db.update.loot.alms(almid, number, favor))
        } else {
          promiseArray.push(db.add.loot.alms(id, number, favor))
        }
      })

      Promise.all(promiseArray).then(_ => {
        updateHewyRating(db, id)
        controllerObj.collectCache(app, 0)
        res.send({ id })
      })
    })
  },
  editBeast({ app, body }, res) {
    const db = app.get('db')
    let { id, name, hr, intro, habitat, ecology, number_min, number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem, patreon, vitality, panic, stress, types, environ, combat, movement, conflict, skills, int, variants, loot, reagents, lootnotes, traitlimit, devotionlimit, flawlimit, passionlimit, encounter, plural, thumbnail, rarity, locationalvitality, lairloot } = body
    // update beast
    db.update.beast(name, hr, intro, habitat, ecology, +number_min, +number_max, senses, diet, meta, sp_atk, sp_def, tactics, size, subsystem ? +subsystem : null, +patreon, vitality, +panic, +stress, +int, lootnotes, +traitlimit > 0 ? +traitlimit : null, +devotionlimit > 0 ? +devotionlimit : null, +flawlimit > 0 ? +flawlimit : null, +passionlimit > 0 ? +passionlimit : null, plural, thumbnail, rarity, id).then(result => {
      let promiseArray = []
      // update types
      types.forEach(val => {
        if (!val.id) {
          promiseArray.push(db.add.beasttype(id, val.typeid).then())
        } else if (val.deleted) {
          promiseArray.push(db.delete.beasttype(val.id).then())
        }
      })
      // update environ
      environ.forEach(val => {
        if (!val.id) {
          promiseArray.push(db.add.beastenviron(id, val.environid).then())
        } else if (val.deleted) {
          promiseArray.push(db.delete.beastenviron(val.id).then())
        }
      })
      // update combat
      combat.forEach(({ spd, atk, init, def, dr, shield_dr, measure, damage, parry, fatigue, weapon, id: weaponId, deleted, weapontype, ranges }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastcombat(weaponId).then())
        } else if (!weaponId) {
          promiseArray.push(db.add.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, fatigue, weapon, weapontype).then(result => {
            if (weapontype === 'r') {
              return db.add.combatranges(result.weaponid, +ranges.thirtytwo).then()
            }
            return true;
          }))
        } else {
          promiseArray.push(db.update.beastcombat(id, spd, atk, init, def, dr, shield_dr, measure, damage, parry, fatigue, weapon, weaponId, weapontype).then())
          if (weapontype === 'r' && ranges.id) {
            promiseArray.push(db.update.combatranges(weaponId, +ranges.thirtytwo).then())
          } else if (weapontype === 'r') {
            promiseArray.push(db.add.combatranges(weaponId, +ranges.thirtytwo).then())
          }
        }
      })
      // update conflict
      let newConflict = []
      Object.keys(conflict).forEach(key => newConflict = [...newConflict, ...conflict[key]])
      newConflict.forEach(({ trait, value, type, id: conflictId, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastconflict(conflictId).then())
        } else if (!conflictId) {
          promiseArray.push(db.add.beastconflict(id, trait, value, type).then())
        } else {
          promiseArray.push(db.update.beastconflict(id, trait, value, type, conflictId).then())
        }
      })
      // update skills
      skills.forEach(({ skill, rank, id: skillId, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastskill(skillId).then())
        } else if (!skillId) {
          promiseArray.push(db.add.beastskill(id, skill, rank).then())
        } else {
          promiseArray.push(db.update.beastskill(id, skill, rank, skillId).then())
        }
      })
      // update movement
      movement.forEach(({ stroll, walk, jog, run, sprint, type, id: movementId, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastmovement(movementId).then())
        } else if (!movementId) {
          promiseArray.push(db.add.beastmovement(id, stroll, walk, jog, run, sprint, type).then())
        } else {
          promiseArray.push(db.update.beastmovement(id, stroll, walk, jog, run, sprint, type, movementId).then())
        }
      })
      // update variants
      variants.forEach(({ id: checkId, variantid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastvariants(id, variantid).then())
          promiseArray.push(db.delete.beastvariants(variantid, id).then())
        } else if (!checkId) {
          promiseArray.push(db.add.beastvariants(id, variantid).then())
          promiseArray.push(db.add.beastvariants(variantid, id).then())
        }
      })
      // update loot
      loot.forEach(({ loot, price, id: lootId, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastloot(lootId).then())
        } else if (!lootId) {
          promiseArray.push(db.add.beastloot(id, loot, price).then())
        } else {
          promiseArray.push(db.update.beastloot(id, loot, price, lootId).then())
        }
      })
      // update reagents
      reagents.forEach(({ name, spell, difficulty, harvest, id: reagentId, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.beastreagents(reagentId).then())
        } else if (!reagentId) {
          promiseArray.push(db.add.beastreagents(id, name, spell, difficulty, harvest).then())
        } else {
          promiseArray.push(db.update.beastreagents(id, name, spell, difficulty, harvest, reagentId).then())
        }
      })

      if (locationalvitality.length > 0) {
        locationalvitality.forEach(({ id: locationid, location, vitality, beastid, deleted }) => {
          if (deleted) {
            promiseArray.push(db.delete.locationalvitality(locationid))
          } else if (locationid && beastid) {
            promiseArray.push(db.update.locationalvitality(beastid, location, vitality, locationid))
          } else {
            promiseArray.push(db.add.locationalvitality(id, location, vitality))
          }
        })
      }

      let { temperament } = encounter;
      temperament.temperament.forEach(({ temperament: temp, weight, id: tempid, beastid, tooltip, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.temperament(beastid, tempid))
        } else if ((tempid && !beastid) || (tempid && beastid !== id)) {
          promiseArray.push(db.add.encounter.temperament(id, tempid, weight))
        } else if (tempid && beastid) {
          promiseArray.push(db.update.encounter.temperament(weight, beastid, tempid))
        } else if (!tempid) {
          db.add.encounter.allTemp(temp, tooltip).then(result => {
            promiseArray.push(db.add.encounter.temperament(id, result[0].id, weight))
          })
        }
      })

      let { rank } = encounter;
      rank.rank.forEach(({ rank: rank, weight, id: rankid, beastid, lair, othertypechance, decayrate, deleted, number }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.rank(beastid, rankid))
        } else if ((rankid && !beastid) || (rankid && beastid !== id)) {
          promiseArray.push(db.add.encounter.rank(rankid, id, weight, othertypechance, decayrate, lair, number))
        } else if (rankid && beastid) {
          promiseArray.push(db.update.encounter.rank(rankid, id, weight, othertypechance, decayrate, lair, number))
        } else if (!rankid) {
          db.add.encounter.allRank(rank).then(result => {
            promiseArray.push(db.add.encounter.rank(result[0].id, id, weight, othertypechance, decayrate, lair, number))
          })
        }
      })

      let { verb } = encounter;
      verb.verb.forEach(({ verb, id: verbid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.verb(beastid, verbid))
        } else if ((verbid && !beastid) || (verbid && beastid !== id)) {
          promiseArray.push(db.add.encounter.verb(verbid, id))
        } else if (!verbid) {
          db.add.encounter.allVerb(verb).then(result => {
            promiseArray.push(db.add.encounter.verb(result[0].id, id))
          })
        }
      })

      let { noun } = encounter;
      noun.noun.forEach(({ noun, id: nounid, beastid, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.encounter.noun(beastid, nounid))
        } else if ((nounid && !beastid) || (nounid && beastid !== id)) {
          promiseArray.push(db.add.encounter.noun(nounid, id))
        } else if (!nounid) {
          db.add.encounter.allNoun(noun).then(result => {
            promiseArray.push(db.add.encounter.noun(result[0].id, id))
          })
        }
      })

      let { beastid, copper, silver, gold, potion, relic, enchanted, equipment, traited, scrolls, alms } = lairloot
      if (!beastid) {
        promiseArray.push(db.add.loot.basic(id, copper, silver, gold, potion, relic, enchanted))
      } else {
        promiseArray.push(db.update.loot.basic(beastid, copper, silver, gold, potion, relic, enchanted))
      }

      equipment.forEach(({ id: equipid, beastid, value, number, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.equipment(beastid, equipid))
        } else if (equipid && beastid) {
          promiseArray.push(db.update.loot.equipment(equipid, value, number))
        } else {
          promiseArray.push(db.add.loot.equipment(id, value, number))
        }
      })

      traited.forEach(({ id: traitedid, beastid, value, chancetable, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.traited(beastid, traitedid))
        } else if (traitedid && beastid) {
          promiseArray.push(db.update.loot.traited(traitedid, value, chancetable))
        } else {
          promiseArray.push(db.add.loot.traited(id, value, chancetable))
        }
      })

      scrolls.forEach(({ id: scrollid, beastid, number, power, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.scrolls(beastid, scrollid))
        } else if (scrollid && beastid) {
          promiseArray.push(db.update.loot.scrolls(scrollid, number, power))
        } else {
          promiseArray.push(db.add.loot.scrolls(id, number, power))
        }
      })

      alms.forEach(({ id: almid, beastid, number, favor, deleted }) => {
        if (deleted) {
          promiseArray.push(db.delete.loot.alms(beastid, almid))
        } else if (almid && beastid) {
          promiseArray.push(db.update.loot.alms(almid, number, favor))
        } else {
          promiseArray.push(db.add.loot.alms(id, number, favor))
        }
      })

      Promise.all(promiseArray).then(_ => {
        updateHewyRating(db, id)
        controllerObj.collectCache(app, 0)
        res.send({ id })
      })
    })
  },
  deleteBeast(req, res) {
    const db = req.app.get('db')
    let id = +req.params.id

    db.delete.beast(id).then(_ => {
      let promiseArray = []

      promiseArray.push(db.delete.allbeasttypes(id).then())
      promiseArray.push(db.delete.allbeastenviron(id).then())
      promiseArray.push(db.delete.allbeastcombat(id).then())
      promiseArray.push(db.delete.allbeastconflict(id).then())
      promiseArray.push(db.delete.allbeastskill(id).then())
      promiseArray.push(db.delete.allbeastloot(id).then())
      promiseArray.push(db.delete.allbeastmovement(id).then())
      promiseArray.push(db.delete.allbeastreagents(id).then())
      promiseArray.push(db.delete.encounter.allNoun(id).then())
      promiseArray.push(db.delete.encounter.allTemperament(id).then())
      promiseArray.push(db.delete.encounter.allVerb(id).then())
      promiseArray.push(db.delete.encounter.allRank(id).then())
      promiseArray.push(db.delete.alllocationalvitality(id).then())
      promiseArray.push(db.delete.loot.basic(id).then())
      promiseArray.push(db.delete.loot.allequipment(id).then())
      promiseArray.push(db.delete.loot.alltraited(id).then())
      promiseArray.push(db.delete.loot.allscrolls(id).then())
      promiseArray.push(db.delete.loot.allalms(id).then())
      // promiseArray.push(db.delete.beastvariants(id, variantid).then())
      // promiseArray.push(db.delete.combatranges(id, variantid).then())

      Promise.all(promiseArray).then(_ => {
        controllerObj.collectCache(req.app, 0)
        res.send({ id })
      })
    })
  },
  addFavorite(req, res) {
    const db = req.app.get('db')
      , { beastid } = req.body
    if (req.user && req.user.id) {
      db.get.favoriteCount(req.user.id).then(result => {
        if (+result[0].count <= ((req.user.patreon * 3) + 3)) {
          db.add.favorite(req.user.id, beastid).then(_ => res.send({ color: "green", message: `Monster Favorited` }))
        } else {
          res.send({ color: "yellow", message: "You have too many favorited monsters: delete some or upgrade your Patreon tier" })
        }
      })
    } else {
      res.send({ color: "red", message: "You Need to Log On to Favorite Monsters" })
    }
  },
  deleteFavorite(req, res) {
    const db = req.app.get('db')
      , { beastid } = req.params
    if (req.user && req.user.id) {
      db.delete.favorite(req.user.id, beastid).then(_ => res.send({ color: "green", message: 'Monster Unfavorited' }))
    } else {
      res.send({ color: "red", message: "You Need to Log On to Unfavorite Monsters" })
    }
  },
  getUsersFavorites(req, res) {
    const db = req.app.get('db')
    if (req.user && req.user.id) {
      db.get.favorites(req.user.id).then(result => res.send(result))
    } else {
      res.send({ color: "red", message: "You Need to Log On to Favorite Monsters" })
    }
  },
  getEditEncounter(req, res) {
    const db = req.app.get('db')
    let promiseArray = []
      , encounterObject = {
        temperament: {},
        rank: {},
        verb: {},
        noun: {}
      }
      , beastid = +req.params.beastid

    promiseArray.push(db.get.encounter.temperament(beastid).then(result => {
      encounterObject.temperament.temperament = result
      return result
    }))
    promiseArray.push(db.get.encounter.allTemp(beastid).then(result => {
      encounterObject.temperament.allTemp = result
      return result
    }))

    promiseArray.push(db.get.encounter.allRank(beastid).then(result => {
      encounterObject.rank.allRank = result
      return result
    }))
    promiseArray.push(db.get.encounter.rank(beastid).then(result => {
      encounterObject.rank.rank = result
      return result
    }))

    promiseArray.push(db.get.encounter.verb(beastid).then(result => {
      encounterObject.verb.verb = result
      return result
    }))
    promiseArray.push(db.get.encounter.allVerb(beastid).then(result => {
      encounterObject.verb.allVerb = result
      return result
    }))

    promiseArray.push(db.get.encounter.noun(beastid).then(result => {
      encounterObject.noun.noun = result
      return result
    }))
    promiseArray.push(db.get.encounter.allNoun(beastid).then(result => {
      encounterObject.noun.allNoun = result
      return result
    }))

    Promise.all(promiseArray).then(_ => {
      res.send(encounterObject)
    })
  },
  getRandomEncounter(req, res) {
    const db = req.app.get('db')
    let promiseArray = []
      , encounterObject = {}
      , beastId = +req.params.beastid

    promiseArray.push(db.get.encounter.tempWeighted(beastId).then(result => {
      encounterObject.temperament = result[0]
      return result
    }))

    promiseArray.push(db.get.encounter.verbWeighted(beastId).then(result => {
      if (result[0]) {
        encounterObject.verb = result[0].verb
      }
      return result
    }))

    promiseArray.push(db.get.encounter.nounWeighted(beastId).then(result => {
      if (result[0]) {
        encounterObject.noun = result[0].noun
      }
      return result
    }))

    promiseArray.push(db.get.encounter.battlefield(beastId).then(result => {
      if (result[0]) {
        encounterObject.battlefield = result[0].battlefield
      }
      return result
    }))

    promiseArray.push(db.get.encounter.rankWeighted(beastId).then(result => {
      let mainPlayers = result
        , underlingNumber = 0
        , otherPlayers = []

      if (mainPlayers[0]) {
        while (mainPlayers[0].othertypechance > 0) {
          let percentRoll = Math.floor(Math.random() * 100) + 1
          if (percentRoll <= mainPlayers[0].othertypechance) { ++underlingNumber }
          mainPlayers[0].othertypechance -= mainPlayers[0].decayrate;
        }

        for (let i = 0; i < underlingNumber; i++) {
          randomNumber = Math.floor(Math.random() * 31) + 1
          if (randomNumber > 30) {
            otherPlayers.push(db.get.otherplayers.any(beastId).then(result => result[0]))
          } else if (randomNumber > 25) {
            otherPlayers.push(db.get.otherplayers.type(beastId).then(result => result[0]))
          } else {
            otherPlayers.push(db.get.otherplayers.exact(beastId, mainPlayers[0].rankid).then(result => {
              if (result[0]) {
                mainPlayers.push(result[0])
                return false
              } else {
                return db.get.otherplayers.type(beastId).then(result => result[0])
              }
            }))
          }
        }

        return Promise.all(otherPlayers).then(finalOtherPlayers => {
          let beastRank = {}
          beastRank.mainPlayers = mainPlayers
          beastRank.otherPlayers = finalOtherPlayers.filter(person => person)
          beastRank.lair = beastRank.mainPlayers[0].lair
          encounterObject.rank = beastRank
          return beastRank
        })
      } else {
        return []
      }
    }))

    if (Math.floor(Math.random() * 10) > 5) {
      promiseArray.push(collectComplication(db, beastId).then(result => {
        let flatArray = []
        if (result.length) {
          result.forEach(element => {
            if (element.length) {
              element.forEach(val => flatArray.push(val))
            } else {
              flatArray.push(element)
            }
          })
        } else {
          flatArray.push(result)
        }
        encounterObject.complication = flatArray
        return result
      }))
    }

    Promise.all(promiseArray).then(_ => {
      res.send(encounterObject)
    })
  }
}

async function collectComplication(db, beastId) {
  return db.get.complication.complication().then(result => {
    let complication = result[0]
    if (complication.id === 1) {
      //rival
      return db.get.complication.rival(beastId).then(result => {
        return {
          id: 1,
          type: 'Rival',
          rival: result[0]
        }
      })
    } else if (complication.id === 2) {
      //wounded
      return db.get.complication.rival(beastId).then(result => {
        let woundCategories = ['Hurt', 'Bloodied', 'Wounded', 'Bleeding Out']
        return {
          id: 2,
          type: 'Wounded',
          byWhom: result[0],
          amount: woundCategories[Math.floor(Math.random() * 3)]
        }
      })
    } else if (complication.id === 5) {
      //lost
      return { id: 5, type: 'Lost', distance: '10d10' }
    } else if (complication.id === 8) {
      //Back up coming
      return db.get.complication.backup(beastId).then(result => {
        return {
          id: 8,
          type: 'Back Up Coming',
          backup: result[0],
          time: '30d2'
        }
      })
    } else if (complication.id >= 12) {
      //roll an additional time
      let promiseArray = []
      promiseArray.push(collectComplication(db, beastId).then(result => {
        return result
      }))
      promiseArray.push(collectComplication(db, beastId).then(result => {
        return result
      }))
      return Promise.all(promiseArray).then(result => {
        let flatArray = []
        if (result[0].length) {
          result[0].forEach(val => flatArray.push(val))
        } else {
          flatArray.push(result)
        }
        if (result[1].length) {
          result[1].forEach(val => flatArray.push(val))
        } else {
          flatArray.push(result)
        }
        return flatArray
      })
    } else {
      return complication
    }
  })
}

module.exports = controllerObj