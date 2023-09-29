import { RadioGroup, RadioGroupItem } from '../components/RadioGroup';
import { Label } from '../components/Label';
import { Manifest } from './typedefs';

interface SetCamerasProps {
    currentManifest?: Manifest,
    handleCameraChange: (value: string) => void,
    earthDate?: Date,
    sol?: string
}

export const SetCameras = ({ currentManifest, handleCameraChange, earthDate, sol }: SetCamerasProps) => {
    let cameras: JSX.Element[] | undefined;

    if (earthDate) {
        const manifestOfEarthDate = currentManifest?.photos.find((manifest) => manifest.earth_date === earthDate.toISOString().split('T')[0] )
        cameras = manifestOfEarthDate?.cameras.map((camera) => {
            return (
                <div className="flex items-center space-x-2" key={camera}>
                    <RadioGroupItem value={camera} id={camera} />
                    <Label htmlFor={camera}>{camera}</Label>
                </div>
            )
        })
    } else if (sol) {
        const manifestOfSol = currentManifest?.photos.find((manifest) => manifest.sol === Number(sol));
        cameras = manifestOfSol?.cameras.map((camera) => {
            return (
                <div className="flex items-center space-x-2" key={camera}>
                    <RadioGroupItem value={camera} id={camera} />
                    <Label htmlFor={camera}>{camera}</Label>
                </div>
            )
        })

    }

    cameras?.unshift(
        <div className="flex items-center space-x-2" key="all">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All Cameras</Label>
        </div>
    )

    return (
        <div className="flex flex-col items-center my-4 sm:mx-24">
            <h1 className="text-2xl font-bold m-2">Filter by Camera:</h1>
            <RadioGroup className="flex flex-row flex-wrap" defaultValue="all" onValueChange={handleCameraChange}>
                {cameras}
            </RadioGroup>
        </div>
    )
}