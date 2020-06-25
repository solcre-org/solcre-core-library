import * as moment from 'moment-timezone';

export class DateUtility {

	//To sql date
	static sqlDate(date: string): string{
		try {
			//Check date
			if(!date){
				return;
			}

			let momentDate: moment.Moment = moment(date);
			return  momentDate.format("YYYY-MM-DD");
		} catch(e){

		}
	}

	//To sql date
	static sqlDateTime(date: string): string{
		try {
			//Check date
			if(!date){
				return;
			}

			let momentDate: moment.Moment = moment(date);
			return  momentDate.format("YYYY-MM-DD HH:mm");
		} catch(e){

		}
	}

	static sqlDateT(date: string): string{
		try {
			//Check date
			if(!date){
				return;
			}

			let momentDate: moment.Moment = moment(date);
			return  momentDate.format("YYYY-MM-DD[T]HH:mm");
		} catch(e){

		}
	}

	//To sql date
	static sqlDateTimeComplete(date: string): string{
		try {
			//Check date
			if(!date){
				return;
			}

			let momentDate: moment.Moment = moment(date);
			return  momentDate.format("YYYY-MM-DD HH:mm:ss");
		} catch(e){

		}
	}
}