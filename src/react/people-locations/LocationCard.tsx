import type { Location } from '../../data/types.ts';

type LocationCardProps = {
  location: Location;
};

export function LocationCard({ location }: LocationCardProps) {
  return (
    <div>
      <h3>{location.name}</h3>
      <p>{location.description}</p>
    </div>
  );
}
