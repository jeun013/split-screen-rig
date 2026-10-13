# Split Screen Rig

Two-panel split screen for After Effects, controlled by one layer, the Splitter.
Select two layers, run the script, then move the Splitter.

![demo](demo.gif)

## Use

1. Put two images or clips in a comp. Select both. The top one becomes the left panel.
2. `File > Scripts > Run Script File...` and choose `SplitScreenRig.jsx`.
3. Move or keyframe **Splitter**'s X position.

## Controls (on the `Splitter` layer)

| Control | What it does |
|---|---|
| Position X | The split line |
| Gap | Space between the two panels |
| Edge Gap | On: the outer margin equals Gap, so the edge gap and the middle gap always match. Off: panels run to the frame edge |
| Roundness | Corner radius of both panels |
| Parallax | 100: the image follows its panel centre. 0: the image stays still and the panel slides over it |

Push the Splitter past either edge and one panel closes while the other fills the frame.
Images are scaled to cover the whole inner area, so no image edge shows at any split.

## Notes

- Each panel is a shape layer set as the alpha matte of its image, and every value is an expression. There is nothing to bake.
- Parallax is limited to 0 to 100, which keeps the panels covered.
- Run it once per comp. A second run stops with a message.
- Also runs in EffectCraft. Written with match names so it does not depend on the interface language.

Demo images were generated with AI.

Made for [Key Stage Stories](https://keystagestories.co.uk). MIT licence.
