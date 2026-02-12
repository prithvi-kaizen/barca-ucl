import { DataSet, Season, CrossSeasonData } from './types';
import rawData from '../../public/data/barca_ucl_data.json';

const data = rawData as unknown as DataSet;

export function getAllSeasons(): Season[] {
  return data.seasons;
}

export function getSeasonById(id: string): Season | undefined {
  return data.seasons.find(s => s.id === id);
}

export function getCrossSeasonData(): CrossSeasonData {
  return data.cross_season;
}

export function getMetadata() {
  return data.metadata;
}
