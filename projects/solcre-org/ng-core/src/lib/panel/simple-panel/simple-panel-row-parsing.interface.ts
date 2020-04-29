import { DataBaseModelInterface } from '../../api/data-base-model.interface';

export interface SimplePanelRowParsingInterface {
	callback: (model: DataBaseModelInterface) => void;
	json: any;
}