export type RoverPhoto = {
    id: number,
    sol: number,
    camera: {
      id: number,
      name: string,
      rover_id: number,
      full_name: string
    },
    img_src: string,
    earth_date: string,
    rover: {
      id: number,
      name: string,
      landing_date: string,
      launch_date: string,
      status: string,
      max_sol: number,
      max_date: string,
      total_photos: number,
      cameras: {
        name: string,
        full_name: string
      }[]
    }
  };

export type RoverApiResponse = { photos: RoverPhoto[] };

export type Manifest = {
  name: string,
  landing_date: string,
  launch_date: string,
  status: string,
  max_sol: number,
  max_date: string,
  total_photos: number,
  photos: {
    sol: number,
    earth_date: string,
    total_photos: number,
    cameras: string[]
  }[]
}

export type ManifestApiResponse = {
  photo_manifest: Manifest
}