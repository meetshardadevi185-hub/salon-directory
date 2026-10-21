export function CityLandmark({ city }: { city: string }) {
  return <span className={`city-landmark city-landmark--${city}`} aria-hidden="true" />;
}
