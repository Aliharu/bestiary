module.exports = {
    combatRoles: {
        primary: {
            'Artillery': {
                strengths: ['Vitality', 'Ranged Damage', 'Ranged Attack', 'Ranged Penalties'],
                weaknesses: ['/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Melee Damage', 'Melee Attack', 'Recovery', 'Movement', 'Caution Threshold'],
                vitality: 30,
                fatigue: 25,
                def: 0,
                dr: {
                    flat: 0,
                    slash: 0
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['2d4!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: ['2d10!'],
                    flat: 0
                },
                atk: 0,
                rangedAtk: 5,
                spd: 20,
                measure: 1,
                ranges: {
                    increment: 100
                },
                stressThreshold: 30,
                panic: 25,
                caution: 10,
                init: 0,
                combatpointsmelee: 0,
                combatpointsranged: 0,
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Longbow (P)', 'Dagger (S)', 'Dagger (P)']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Crossbow (P)', 'Bellybow (P)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Warbow (P)', 'Sling (C)']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choices',
                        items: ['None']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Buff Coat']
                    }
                ],
                shields: {
                    label: 'Not Preferred Choices',
                    items: ['Buckler']
                }
            },
            'Brute': {
                strengths: ['Vitality', 'Melee Damage', 'Melee Attack', 'Caution Threshold'],
                weaknesses: ['Defense', 'Parry', 'Parry DR', 'Parry /DR', 'Ranged Damage', 'Ranged Attack', 'Recovery', 'Ranged Penalties', 'Movement', 'Mobility Skills'],
                vitality: 80,
                fatigue: 50,
                def: -4,
                dr: {
                    flat: 3,
                    slash: 1
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['3d8!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: [],
                    flat: 0
                },
                atk: 4,
                rangedAtk: 0,
                spd: 15,
                measure: 2,
                ranges: {
                    increment: 0
                },
                stressThreshold: 30,
                panic: 25,
                caution: 20,
                init: 0,
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Bardiche (S)', 'Zweihander (S)']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Bec De Corbin (C)', 'Ranseur (P)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Peasant\'s Flail (C)', 'Lucerne (C)']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choices',
                        items: ['Chainmail']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Plated Mail']
                    },
                ],
                shields: [],
            },
            'Defender': {
                strengths: ['Defense', 'DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Stress Threshold', 'Caution Threshold'],
                weaknesses: ['Melee Damage', 'Ranged Damage', 'Melee Attack', 'Ranged Attack', 'Ranged Penalties', 'Movement', 'Mobility Skills'],
                vitality: 40,
                fatigue: 25,
                def: -3,
                dr: {
                    flat: 2,
                    slash: 2
                },
                parry: 7,
                shield_dr: {
                    flat: 2,
                    slash: 2
                },
                damage: {
                    dice: ['4d3!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: [],
                    flat: 0
                },
                atk: 0,
                rangedAtk: 0,
                spd: 12,
                measure: 2,
                ranges: {
                    increment: 0
                },
                stressThreshold: 40,
                panic: 50,
                caution: 30,
                init: 0,
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Longsword (S)', 'Dagger (S)', 'Dagger (P)']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Court Sword (P)', 'War Hammer (C)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['War Flail (C)', 'Short Spear (P)']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choices',
                        items: ['Scale']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Laminar (Banded Mail)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Full Plate']
                    }
                ],
                shields: [
                    {
                        label: 'Preferred Choices',
                        items: ['Heater']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Figure Eight']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Kite']
                    }
                ],
            },
            'Fencer': {
                strengths: ['Parry', 'Recovery', 'Mobility Skills', 'Stress Threshold'],
                weaknesses: ['/DR', 'Melee Damage', 'Ranged Damage', 'Range Penalties'],
                vitality: 30,
                fatigue: 25,
                def: 0,
                dr: {
                    flat: 3,
                    slash: 0
                },
                parry: 4,
                shield_dr: {
                    flat: 0,
                    slash: 2
                },
                damage: {
                    dice: ['2d6!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: [],
                    flat: 0
                },
                atk: 1,
                rangedAtk: 0,
                spd: 5,
                measure: 2,
                ranges: {
                    increment: 0
                },
                stressThreshold: 40,
                panic: 50,
                caution: 20,
                init: 0,
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Rapier (P)', 'Stiletto (P)']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Messer (S)', 'Court Sword (P)', 'Estoc (P)']
                    },
                    {
                        label: 'Not Preferred Choice',
                        items: ['Military Fork (P)']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choices',
                        items: ['Gambeson']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Leather']
                    }
                ],
                shields: [
                    {
                        label: 'Neutral Choices',
                        items: ['Buckler']
                    },
                ]
            },
            'Flanker': {
                strengths: ['Melee Damage', 'Recovery', 'Movement', 'Mobility Skills'],
                weaknesses: ['Defense', 'DR', '/DR', 'Ranged Damage', 'Melee Attack', 'Ranged Attack', 'Range Penalties', 'Caution Threshold'],
                vitality: 30,
                fatigue: 25,
                def: 0,
                dr: {
                    flat: 0,
                    slash: 0
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['3d6!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: [],
                    flat: 0
                },
                atk: -2,
                rangedAtk: 0,
                spd: 7,
                measure: 0,
                ranges: {
                    increment: 0
                },
                stressThreshold: 30,
                panic: 25,
                caution: 10,
                init: 0,
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Knife (S)', 'Throwing Knife (P)', 'Dagger (S)', 'Dagger (P)']
                    },
                    {
                        label: 'Neutral Choice',
                        items: ['Katzbalger (S)']
                    },
                    {
                        label: 'Not Preferred Choice',
                        items: ['Bludgeon (C)']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choices',
                        items: ['Gambeson']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Leather']
                    },
                ],
                shields: []
            },
            'Fodder': {
                strengths: ['Melee Damage', 'Ranged Damage', 'Melee Attack', 'Mobility Skills'],
                weaknesses: ['Vitality', 'Fatigue', '/DR', 'DR', 'Parry', 'Parry DR', 'Parry /DR', 'Movement', 'Stress Threshold', 'Panic Threshold', 'Caution Threshold'],
                vitality: 15,
                fatigue: 1,
                def: -2,
                dr: {
                    flat: 0,
                    slash: 0
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['4d4!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: ['3d4!'],
                    flat: 0
                },
                atk: 0,
                rangedAtk: 0,
                spd: 13,
                measure: 2,
                ranges: {
                    increment: 15
                },
                stressThreshold: 15,
                panic: 1,
                caution: 10,
                init: 0,
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Messer (S)', 'Handaxe (S)', 'Throwing Axe (S)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Bludgeon (C)', 'Club (C)', 'Short Spear (P)', 'Sling (C)']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choices',
                        items: ['None']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Buff coat']
                    }
                ],
                shields: [
                    {
                        label: 'Neutral Choices',
                        items: ['Clothe']
                    }
                ],
            },
            'Shock': {
                strengths: ['Fatigue', 'Melee Damage', 'Measure', 'Movement', 'Mobility Skills', 'Panic Threshold', 'Caution Threshold'],
                weaknesses: ['DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Ranged Damage', 'Ranged Attack', 'Recovery', 'Range Penalties'],
                vitality: 40,
                fatigue: 25,
                def: -4,
                dr: {
                    flat: 0,
                    slash: 0
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['2d12!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: [],
                    flat: 0
                },
                atk: 2,
                rangedAtk: 0,
                spd: 20,
                measure: 5.5,
                ranges: {
                    increment: 0
                },
                stressThreshold: 30,
                panic: 25,
                caution: 20,
                init: 0,
                weapons: [
                    {
                        label: 'Preferred Choice',
                        items: ['Maul (C)']
                    }, 
                    {
                        label: 'Neutral Choices',
                        items: ['Glaive (S)', 'Lucerne (C)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Zweihander (S)', 'Lochaber Axe']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choices',
                        items: ['Coat of Plates']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['None']
                    }
                ],
                shields: []
            },
            'Skirmisher': {
                strengths: ['Ranged Attack', 'Movement', 'Mobility Skills', 'Stress Threshold', 'Panic'],
                weaknesses: ['DR', '/DR', 'Parry', 'Parry DR', 'Parry /DR', 'Melee Damage', 'Ranged Damage', 'Melee Attack', 'Caution Threshold'],
                vitality: 30,
                fatigue: 25,
                def: 0,
                dr: {
                    flat: 0,
                    slash: 0
                },
                parry: 0,
                shield_dr: {
                    flat: 0,
                    slash: 0
                },
                damage: {
                    dice: ['3d3!'],
                    flat: 0
                },
                rangedDamage: {
                    dice: ['4d3!'],
                    flat: 0
                },
                atk: 0,
                rangedAtk: 2,
                spd: 11,
                measure: 1,
                ranges: {
                    increment: 15
                },
                stressThreshold: 30,
                panic: 25,
                caution: 20,
                init: 0,
                weapons: [
                    {
                        label: 'Preferred Choices',
                        items: ['Knife (S)', 'Throwing Knife (P)', 'Handaxe (S)', 'Throwing Axe (S)']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Javelin (P)', 'Short Spear (P)']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Handgonne (C)', 'Sling (C)']
                    }
                ],
                armor: [
                    {
                        label: 'Preferred Choices',
                        items: ['None']
                    },
                    {
                        label: 'Neutral Choices',
                        items: ['Gambeson']
                    },
                    {
                        label: 'Not Preferred Choices',
                        items: ['Leather']
                    }
                ],
                shields: [
                    {
                        label: 'Not Preferred Choices',
                        items: ['Buckler']
                    }
                ],
            }
        }
    }
}