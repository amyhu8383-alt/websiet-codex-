import { ExternalLink, MapPin } from "lucide-react";

type Props = { title: string; label: string; address: string; coordinates: { lat: number; lon: number }; bbox: [number, number, number, number] };

export function LocationMap({ title, label, address, coordinates, bbox }: Props) {
  const openMap = `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`;
  const zoom = 13;
  const scale = 2 ** zoom;
  const tileX = Math.floor((coordinates.lon + 180) / 360 * scale);
  const tileY = Math.floor((1 - Math.asinh(Math.tan(coordinates.lat * Math.PI / 180)) / Math.PI) / 2 * scale);
  const tiles = [[tileX-1,tileY],[tileX,tileY],[tileX+1,tileY],[tileX-1,tileY+1],[tileX,tileY+1],[tileX+1,tileY+1]];
  return <article className="location-card"><div className="location-map" data-bbox={bbox.join(",")}><div className="osm-tiles" aria-hidden="true">{tiles.map(([x,y])=><div key={`${x}-${y}`} style={{backgroundImage:`url(https://tile.openstreetmap.org/${zoom}/${x}/${y}.png)`}} />)}</div><div className="map-pin"><MapPin/><span>{title}</span></div><a className="osm-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></div><div className="location-copy"><span className="location-label"><MapPin size={16}/>{label}</span><h3>{title}</h3><p>{address}</p><a href={openMap} target="_blank" rel="noreferrer">Open in OpenStreetMap <ExternalLink size={15}/></a></div></article>;
}
