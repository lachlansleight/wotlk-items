# WotLK Items

Kind of a combination of AtlasLoot and EightyUpgrades.

Paste in your EightyUpgrades character to import your gear and stat weightings, and view a list of all items in an instance that are an upgrade for you, along with droprates.

Optionally paste in a softres.it weakaura export to determine an optimal SR strategy. Although I might remove that feature since I can imagine it would make people behave a little bit toxic with the way they strategise SR choices...

At the moment (v0.1.0) there are plenty of bugs - I know for a fact that the stat weighting values aren't 100% the same as eightyupgrades, most of the WOTLK loot tables are corrupted, there are some broken instance names, and the whole thing is super inefficient since it's recalculating a shitload of data with every change.

Things still to do:

-   [x] Fix the WotLK loot tables
-   [x] Fix the broken instance names, boss names, etc.
-   [ ] Create exchange list (tier tokens, sunmotes, quest items e.g. verdant sphere, etc)
-   [ ] Create dense, finalized equippable item list
-   [ ] Put all the data in context, for easy access by any component
-   [ ] Figure out why some stat weightings are incorrect
-   [ ] Make it possible to save a character for easy selection later (assuming nothing has changed on eightyupgrades)
-   [ ] Show all three stat weightings simultaneously
-   [ ] Add in softres.it import for SR strategy values
