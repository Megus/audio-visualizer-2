import * as L from "../../../common/layers";
import MegusLogo from "../../layers/MegusLogo";
import TrackTitle from "../../layers/TrackTitle";

import RubicsCube from "./RubicsCube";

const layers = [
  {
    layer: RubicsCube,
    id: "rubic",
  },
  {
    layer: MegusLogo,
    id: "megus",
  },
  {
    layer: TrackTitle,
    c: { title: "Routine" },
    p: { pos: [0, 900] }
  },
];

export default layers;