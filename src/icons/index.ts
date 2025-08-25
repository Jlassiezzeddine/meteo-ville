import { Wind, Eye, Droplet } from "lucide-react";

const Icons = {
  wind: Wind,
  eye: Eye,
  droplet: Droplet,
};

export type IconVariant = keyof typeof Icons;

export default Icons;
