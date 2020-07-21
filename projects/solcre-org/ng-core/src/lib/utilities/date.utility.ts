import * as moment from 'moment-timezone';

export class DateUtility {

	//To sql date
	static sqlDate(date: string, format?: string): string{
		try {
			//Check date
			if(!date){
				return;
			}

			let momentDate: moment.Moment = moment(date, format);
			return  momentDate.format("YYYY-MM-DD");
		} catch(e){

		}
	}

	//To sql date
	static sqlDateTime(date: string, format?: string): string{
		try {
			//Check date
			if(!date){
				return;
			}

			let momentDate: moment.Moment = moment(date, format);
			return  momentDate.format("YYYY-MM-DD HH:mm");
		} catch(e){

		}
	}

	static sqlDateT(date: string, format?: string): string{
		try {
			//Check date
			if(!date){
				return;
			}

			let momentDate: moment.Moment = moment(date, format);
			return  momentDate.format("YYYY-MM-DD[T]HH:mm");
		} catch(e){

		}
	}

	//To sql date
	static sqlDateTimeComplete(date: string, format?: string): string{
		try {
			//Check date
			if(!date){
				return;
			}

			let momentDate: moment.Moment = moment(date, format);
			return  momentDate.format("YYYY-MM-DD HH:mm:ss");
		} catch(e){

		}
	}

	//To sql date
	static format(date: string, format?: string): string{
		try {
			//Check date
			if(!date){
				return;
			}

			let momentDate: moment.Moment = moment(date);
			return  momentDate.format(format ? format : "YYYY-MM-DD HH:mm:ss");
		} catch(e){

		}
	}

	//Validate date
	static validate(date: string, format?: string): boolean{
		try {
			//Check date
			if(!date){
				return;
			}

			let momentDate: moment.Moment = moment(date, format);
			return  momentDate.isValid();
		} catch(e){

		}
	}
}