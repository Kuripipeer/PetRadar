import { envs } from '../../config/envs';

export const buildStaticMapUrl = (
  lostLng: number,
  lostLat: number,
  foundLng: number,
  foundLat: number,
) => {
  const lostMarker = `pin-s-a+f44336(${lostLng},${lostLat})`;
  const foundMarker = `pin-s-b+3f51b5(${foundLng},${foundLat})`;

  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${lostMarker},${foundMarker}/auto/600x400?access_token=${envs.MAPBOX_TOKEN}`;
};

export const buildSinglePointMapUrl = (lng: number, lat: number) => {
  const marker = `pin-s-a+3f51b5(${lng},${lat})`;

  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${marker}/${lng},${lat},15/600x400?access_token=${envs.MAPBOX_TOKEN}`;
};
