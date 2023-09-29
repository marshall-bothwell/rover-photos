import axios from 'axios';
import {RoverApiResponse} from './typedefs';

interface SearchRoverPhotosParams {
    rover: string,
    setRoverData: React.Dispatch<React.SetStateAction<RoverApiResponse | null>>,
    sol?: string,
    earthDate?: Date,
};


export const SearchRoverPhotos = async ({ rover, setRoverData, sol, earthDate }: SearchRoverPhotosParams) => {
    if (sol) {
        const { data } = await axios.get<RoverApiResponse>(
            'https://api.nasa.gov/mars-photos/api/v1/rovers/'+rover+'/photos', 
            { params: { sol: sol, api_key: 'mSLNg0jFbrbD6wcMoQ0vZlerdhNN0QCZW8YQy4Ha' } });
            setRoverData(data);
    } else if (earthDate){
        const { data } = await axios.get<RoverApiResponse>(
            'https://api.nasa.gov/mars-photos/api/v1/rovers/'+rover+'/photos', 
            { params: { earth_date: earthDate?.toISOString().split('T')[0], api_key: 'mSLNg0jFbrbD6wcMoQ0vZlerdhNN0QCZW8YQy4Ha' } });
            setRoverData(data);
    }
}