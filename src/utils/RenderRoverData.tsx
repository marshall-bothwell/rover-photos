import { RoverApiResponse } from './typedefs';
import { Dialog, DialogTrigger, DialogContent } from '../components/Dialog';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/Card';

export const RenderRoverData = (roverData: RoverApiResponse | null, camera: string) => {
    const renderedRoverData = roverData?.photos
        .filter((photo) => {
            if (camera === 'all') {
            return true;
            } else {
            return photo.camera.name.toUpperCase() === camera.toUpperCase();
            }
        }).map((photo) => {
            return (
            <Dialog key={photo.id}>
                <Card className="sm:w-2/3 lg:w-1/4  m-4">
                <CardHeader>
                    <CardTitle>{photo.rover.name}</CardTitle>
                    <CardDescription>
                    <span>{photo.camera.full_name}</span><br />
                    <span>{photo.earth_date}</span><br />
                    <span>Sol {photo.sol}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DialogTrigger>
                        <img loading="lazy" src={photo.img_src}/>
                    </DialogTrigger>
                </CardContent>
                </Card>
                <DialogContent>
                    <img className="min-w-full" src={photo.img_src}/>
                </DialogContent>
            </Dialog>
            )
        })
    
    if (roverData) {
        return (
            <div className="flex flex-wrap justify-center">
                {renderedRoverData}
            </div>
        );
    } else {
        return undefined;
    }
    
}