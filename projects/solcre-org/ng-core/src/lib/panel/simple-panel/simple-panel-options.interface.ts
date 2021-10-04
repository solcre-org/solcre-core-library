import { RemoteDataModel } from './remote-data/remote-data.model';

export interface SimplePanelOptions {
	title?: string;
	URI?: string;
	clientCode?: string;
	updateWithPatch?: boolean;
	defaultQueryParams?: any;
	defaultHeaders?: any;
	remoteData?: RemoteDataModel[];
	disableAdd?: boolean;
	preventProcessHttpErrors?: boolean;
	keepIdOnUpdate?: boolean;
}