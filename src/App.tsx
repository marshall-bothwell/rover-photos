import { useState, useEffect } from 'react';

import { Button } from './components/Button';
import { Input } from './components/Input';
import { DatePicker } from './components/DatePicker';
import { Separator } from './components/Separator';
import { RadioGroup, RadioGroupItem } from './components/RadioGroup';
import { Label } from './components/Label';

import { SearchRoverPhotos } from './utils/SearchRoverPhotos';
import { RetrieveManifests } from './utils/RetrieveManifests';
import { SetCameras } from './utils/SetCameras';
import { RenderRoverData } from './utils/RenderRoverData';

import { RoverApiResponse, Manifest } from './utils/typedefs';

const App: React.FC = () => {
  const [rover, setRover] = useState('curiosity');
  const [roverData, setRoverData] = useState<RoverApiResponse | null>(null);
  const [renderedRoverData, setRenderedRoverData] = useState<JSX.Element>();

  const [camera, setCamera] = useState('all');
  const [renderedCameraSelect, setRenderedCameraSelect] = useState<JSX.Element>();

  const [sol, setSol] = useState('');
  const [isSolValid, setIsSolValid] = useState<boolean>(false)
  const [earthDate, setEarthDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<{from: Date; to: Date}>({from: new Date(), to: new Date()});
  const [disabledDays, setDisabledDays] = useState<( Date | {from: Date; to: Date;} )[]>([]);

  const [curiosityManifest, setCuriosityManifest] = useState<Manifest>();
  const [perseveranceManifest, setPerseveranceManifest] = useState<Manifest>();
  const [spiritManifest, setSpiritManifest] = useState<Manifest>();
  const [opportunityManifest, setOpportunityManifest] = useState<Manifest>();
  const [currentManifest, setCurrentManifest] = useState<Manifest>();

  useEffect(() => {
    RetrieveManifests({setCuriosityManifest, setPerseveranceManifest, setSpiritManifest, setOpportunityManifest, setCurrentManifest});
  }, []);

  useEffect(() => {
    setDisabledDays(handleDisabledDays(currentManifest));
    setDateRange(handleDateRange(currentManifest))
  }, [currentManifest])

  useEffect(() => {
    setRenderedRoverData(RenderRoverData(roverData, camera))
  }, [camera, roverData])

  const handleSolSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCamera('all');
    setEarthDate(undefined);
    if (isSolValid) {
      setRenderedCameraSelect(SetCameras({currentManifest, handleCameraChange, sol}));
      SearchRoverPhotos({rover, setRoverData, sol});
    } else {
      setRenderedRoverData(<p className="text-center font-bold">No Photos Available for Sol {sol}</p>)
    }
  }

  const handleDateSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCamera('all');
    setSol('');
    setRenderedCameraSelect(SetCameras({currentManifest, handleCameraChange, earthDate}));
    SearchRoverPhotos({rover, setRoverData, earthDate});
  }

  const handleRoverChange = (selection: string) => {
    setRover(selection);
    setRenderedRoverData(undefined);
    setRoverData(null);
    setCamera('all');
    setEarthDate(undefined);
    setSol('');
    setRenderedCameraSelect(undefined);
    switch(selection) {
      case 'curiosity':
        setCurrentManifest(curiosityManifest);
        break;
      case 'perseverance':
        setCurrentManifest(perseveranceManifest);
        break;
      case 'spirit':
        setCurrentManifest(spiritManifest);
        break;
      case 'opportunity':
        setCurrentManifest(opportunityManifest);
        break;
    }
  }

  const handleCameraChange = (selection: string) => {
    setCamera(selection);
  }

  const handleSolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSol(e.target.value);
    if (e.target.value === '') {
      setIsSolValid(false);
      return;
    }
    if (currentManifest?.photos.find((photo) => photo.sol === Number(e.target.value))) {
      setIsSolValid(true);
    } else {
      setIsSolValid(false);
    }
  }

  const handleDisabledDays = (currentManifest: Manifest | undefined): ({ from: Date, to: Date } | Date)[] => {
    let disabledDays: ({ from: Date, to: Date } | Date)[] = []
    if (currentManifest) {
      let manifestIter = 0;
      for ( let iter = new Date(currentManifest.landing_date+'T12:00:00'); iter < new Date(currentManifest.max_date); iter.setDate(iter.getDate() + 1) ) {
        if (iter.toISOString().split('T')[0] === currentManifest.photos[manifestIter].earth_date) {
          manifestIter += 1;
        }
        else {
          disabledDays.unshift(new Date(iter));
        }
      }
    }
    return disabledDays;
  }
 
  const handleDateRange = (currentManifest: Manifest | undefined): {from: Date, to: Date} => {
    let from = new Date();
    let to = new Date();
    if (currentManifest) {
      from = new Date(currentManifest.landing_date);
      to = new Date(currentManifest.max_date);
    }
    return {from, to};
  }

  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold mt-2">Select a rover:</h1>
        <div className="flex flex-col items-center my-4">
          <RadioGroup className="flex flex-row" defaultValue={rover} onValueChange={handleRoverChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="curiosity" id="curiosity" />
              <Label htmlFor="curiosity">Curiosity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="opportunity" id="opportunity" />
              <Label htmlFor="opportunity">Opportunity</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spirit" id="spirit" />
              <Label htmlFor="spirit">Spirit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="perseverance" id="perseverance" />
              <Label htmlFor="perseverance">Perseverance</Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
        <h1 className="text-2xl font-bold mt-2">Search by Sol or Earth Date:</h1>
        <form onSubmit={handleSolSubmit}>
          <div className="flex flex-row justify-center">
            <Input className={`w-1/6 m-4 ${ isSolValid === false ? 'focus-visible:ring-red-300' : 'focus-visible:ring-green-300' }`} placeholder="Sol" value={sol} onChange={handleSolChange}/>
            <Button className="m-4" variant="secondary">
              Search by Sol
            </Button>
          </div>
        </form>
        <form onSubmit={handleDateSubmit}>
          <div className="flex flex-row justify-center items-center">
            <DatePicker searchDate={earthDate} setSearchDate={setEarthDate} disabled={disabledDays} defaultMonth={dateRange.to} fromDate={dateRange.from} toDate={dateRange.to} />
            <Button className="m-4" variant="secondary">
              Search by Earth Date
            </Button>
          </div>
        </form>
        <Separator />
        { renderedRoverData ? renderedCameraSelect : null}   
        { renderedRoverData ? <Separator className="my-4"/> : null }
      </div>
      {renderedRoverData} 
    </div>
  );
}

export default App;