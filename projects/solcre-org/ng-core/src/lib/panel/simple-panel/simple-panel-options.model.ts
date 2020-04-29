import { RemoteDataModel } from './remote-data/remote-data.model';

export class SimplePanelOptions {

    constructor(
		public URI: string,
		public clientCode?: string,
		public updateWithPatch?: boolean,
		public defaultQueryParams?: any,
		public remoteData?: RemoteDataModel[]
    ){}
}