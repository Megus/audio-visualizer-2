import * as L from "../../../common/layers";
import MegusLogo from "../../layers/MegusLogo";
import TrackTitle from "../../layers/TrackTitle";
import MetaBalls from "../../layers/MetaBalls";

const layers = [
  {
    layer: L.RectLayer,
    p: { color: [14, 25, 29, 1] }
  },
  {
    layer: L.GroupLayer,
    id: "content",
    children: [
      {
        layer: L.RectLayer,
        p: { color: [14, 25, 29, 1] }
      },
      {
        layer: L.ImageLayer,
        id: "l1",
        c: { image: "layer1.png" },
        p: { size: [1620, 1080]}
      },
      {
        layer: L.ImageLayer,
        id: "l2",
        c: { image: "layer2.png" },
        p: { size: [1620, 1080]}
      },
      {
        layer: L.ImageLayer,
        id: "l3",
        c: { image: "layer3.png" },
        p: { size: [1620, 1080] }
      },
      {
        layer: L.ImageLayer,
        id: "l4",
        c: { image: "layer4.png", fit: "aspectFill" },
        p: { alpha: 0.15, size: [1600, 1600] }
      },
      {
        layer: MetaBalls,
        id: "metaballs",
        c: { ballsCount: 12*6 },
        p: { alpha: 0.8, ballScale: 0.01 }
      },
    ]
  },
  {
    layer: MegusLogo,
    id: "megus",
  },
  {
    layer: TrackTitle,
    c: { title: "Good Night" },
    p: { pos: [0, 900] }
  }
];

export default layers;