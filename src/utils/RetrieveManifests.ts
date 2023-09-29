import axios from 'axios';
import { ManifestApiResponse, Manifest } from './typedefs'

interface retrieveManifestParams {
    setCuriosityManifest: React.Dispatch<React.SetStateAction<Manifest | undefined>>,
    setPerseveranceManifest: React.Dispatch<React.SetStateAction<Manifest | undefined>>,
    setSpiritManifest: React.Dispatch<React.SetStateAction<Manifest | undefined>>,
    setOpportunityManifest: React.Dispatch<React.SetStateAction<Manifest | undefined>>,
    setCurrentManifest: React.Dispatch<React.SetStateAction<Manifest | undefined>>,
  }

export const RetrieveManifests = async ({ setCuriosityManifest, setPerseveranceManifest, setSpiritManifest, setOpportunityManifest, setCurrentManifest }: retrieveManifestParams) => {
    const rovers = ['curiosity', 'perseverance', 'spirit', 'opportunity']
    for (let i = 0; i < rovers.length; i++) {
      const { data } = await axios.get<ManifestApiResponse>(
        'https://api.nasa.gov/mars-photos/api/v1/manifests/'+rovers[i],
        { params: { api_key: 'mSLNg0jFbrbD6wcMoQ0vZlerdhNN0QCZW8YQy4Ha'}});
      switch (rovers[i]) {
        case 'curiosity':
          setCuriosityManifest(data.photo_manifest);
          setCurrentManifest(data.photo_manifest);
          break;
        case 'perseverance':
          setPerseveranceManifest(data.photo_manifest);
          break;
        case 'spirit':
          setSpiritManifest(data.photo_manifest);
          break;
        case 'opportunity':
          setOpportunityManifest(data.photo_manifest);
          break;
      }
    }
    
}