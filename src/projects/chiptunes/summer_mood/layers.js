import { FilterLayer, GroupLayer, MirrorLayer, RectLayer } from "../../../common/layers";
import SongInLines from "../../layers/SongInLines";
import MegusLogo from "../../layers/MegusLogo";
import TrackTitle from "../../layers/TrackTitle";

export default [
  {
    layer: FilterLayer,
    c: { shader: "avf_crt1.glsl" },
    children: [
      {
        layer: FilterLayer,
        c: { shader: "avf_fake_zx.glsl" },
        children: [
          {
            layer: MirrorLayer,
            id: "mirror",
            p: { mode: "off" },
            children: [
              {
                layer: RectLayer,
                id: "bg",
                p: { color: [0, 0, 0, 1] },
              },
              {
                layer: SongInLines,
                id: "sil",
                c: { shapes: 24 },
                p: { speed: 500 }
              },
            ]
          }
        ]
      },
    ],
  },
  {
    layer: MegusLogo,
  },
  {
    layer: TrackTitle,
    c: { title: "Summer Mood" },
    p: { pos: [0, 900] },
  }
];
