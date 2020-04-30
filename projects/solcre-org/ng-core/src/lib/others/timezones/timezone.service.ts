import { Injectable } from "@angular/core";
import { TimezoneModel } from './timezone.model';
import { ArrayUtility } from '../../utilities/array.utility';

@Injectable({
	providedIn: 'root',
})
export class TimezoneService {
	// Models
	private timezones: TimezoneModel[];

	// On service created
	constructor() {
		this.timezones = [];

		// Load timezones
		this.loadTimezones();
	}

	// Create timezones array
	private loadTimezones(): void {
		// Load all countries
		this.timezones = [
			new TimezoneModel('Pacific/Midway', "(GMT-11:00) Midway Island"),
			new TimezoneModel('US/Samoa', "(GMT-11:00) Samoa"),
			new TimezoneModel('US/Hawaii', "(GMT-10:00) Hawaii"),
			new TimezoneModel('US/Alaska', "(GMT-09:00) Alaska"),
			new TimezoneModel('US/Pacific', "(GMT-08:00) Pacific Time (US &amp; Canada)"),
			new TimezoneModel('America/Tijuana', "(GMT-08:00) Tijuana"),
			new TimezoneModel('US/Arizona', "(GMT-07:00) Arizona"),
			new TimezoneModel('US/Mountain', "(GMT-07:00) Mountain Time (US &amp; Canada)"),
			new TimezoneModel('America/Chihuahua', "(GMT-07:00) Chihuahua"),
			new TimezoneModel('America/Mazatlan', "(GMT-07:00) Mazatlan"),
			new TimezoneModel('America/Mexico_City', "(GMT-06:00) Mexico City"),
			new TimezoneModel('America/Monterrey', "(GMT-06:00) Monterrey"),
			new TimezoneModel('Canada/Saskatchewan', "(GMT-06:00) Saskatchewan"),
			new TimezoneModel('US/Central', "(GMT-06:00) Central Time (US &amp; Canada)"),
			new TimezoneModel('US/Eastern', "(GMT-05:00) Eastern Time (US &amp; Canada)"),
			new TimezoneModel('US/East-Indiana', "(GMT-05:00) Indiana (East)"),
			new TimezoneModel('America/Bogota', "(GMT-05:00) Bogota"),
			new TimezoneModel('America/Lima', "(GMT-05:00) Lima"),
			new TimezoneModel('America/Caracas', "(GMT-04:30) Caracas"),
			new TimezoneModel('Canada/Atlantic', "(GMT-04:00) Atlantic Time (Canada)"),
			new TimezoneModel('America/La_Paz', "(GMT-04:00) La Paz"),
			new TimezoneModel('America/Santiago', "(GMT-04:00) Santiago"),
			new TimezoneModel('Canada/Newfoundland', "(GMT-03:30) Newfoundland"),
			new TimezoneModel('America/Buenos_Aires', "(GMT-03:00) Buenos Aires"),
			new TimezoneModel('America/Montevideo', "(GMT-03:00) Montevideo"),
			new TimezoneModel('Greenland', "(GMT-03:00) Greenland"),
			new TimezoneModel('Atlantic/Stanley', "(GMT-02:00) Stanley"),
			new TimezoneModel('Atlantic/Azores', "(GMT-01:00) Azores"),
			new TimezoneModel('Atlantic/Cape_Verde', "(GMT-01:00) Cape Verde Is."),
			new TimezoneModel('Africa/Casablanca', "(GMT) Casablanca"),
			new TimezoneModel('Europe/Dublin', "(GMT) Dublin"),
			new TimezoneModel('UTC', "(UTC) Tiempo Universal Coordinado"),
			new TimezoneModel('Europe/Lisbon', "(GMT) Lisbon"),
			new TimezoneModel('Europe/London', "(GMT) London"),
			new TimezoneModel('Africa/Monrovia', "(GMT) Monrovia"),
			new TimezoneModel('Europe/Amsterdam', "(GMT+01:00) Amsterdam"),
			new TimezoneModel('Europe/Belgrade', "(GMT+01:00) Belgrade"),
			new TimezoneModel('Europe/Berlin', "(GMT+01:00) Berlin"),
			new TimezoneModel('Europe/Bratislava', "(GMT+01:00) Bratislava"),
			new TimezoneModel('Europe/Brussels', "(GMT+01:00) Brussels"),
			new TimezoneModel('Europe/Budapest', "(GMT+01:00) Budapest"),
			new TimezoneModel('Europe/Copenhagen', "(GMT+01:00) Copenhagen"),
			new TimezoneModel('Europe/Ljubljana', "(GMT+01:00) Ljubljana"),
			new TimezoneModel('Europe/Madrid', "(GMT+01:00) Madrid"),
			new TimezoneModel('Europe/Paris', "(GMT+01:00) Paris"),
			new TimezoneModel('Europe/Prague', "(GMT+01:00) Prague"),
			new TimezoneModel('Europe/Rome', "(GMT+01:00) Rome"),
			new TimezoneModel('Europe/Sarajevo', "(GMT+01:00) Sarajevo"),
			new TimezoneModel('Europe/Skopje', "(GMT+01:00) Skopje"),
			new TimezoneModel('Europe/Stockholm', "(GMT+01:00) Stockholm"),
			new TimezoneModel('Europe/Vienna', "(GMT+01:00) Vienna"),
			new TimezoneModel('Europe/Warsaw', "(GMT+01:00) Warsaw"),
			new TimezoneModel('Europe/Zagreb', "(GMT+01:00) Zagreb"),
			new TimezoneModel('Europe/Athens', "(GMT+02:00) Athens"),
			new TimezoneModel('Europe/Bucharest', "(GMT+02:00) Bucharest"),
			new TimezoneModel('Africa/Cairo', "(GMT+02:00) Cairo"),
			new TimezoneModel('Africa/Harare', "(GMT+02:00) Harare"),
			new TimezoneModel('Europe/Helsinki', "(GMT+02:00) Helsinki"),
			new TimezoneModel('Europe/Istanbul', "(GMT+02:00) Istanbul"),
			new TimezoneModel('Asia/Jerusalem', "(GMT+02:00) Jerusalem"),
			new TimezoneModel('Europe/Kiev', "(GMT+02:00) Kyiv"),
			new TimezoneModel('Europe/Minsk', "(GMT+02:00) Minsk"),
			new TimezoneModel('Europe/Riga', "(GMT+02:00) Riga"),
			new TimezoneModel('Europe/Sofia', "(GMT+02:00) Sofia"),
			new TimezoneModel('Europe/Tallinn', "(GMT+02:00) Tallinn"),
			new TimezoneModel('Europe/Vilnius', "(GMT+02:00) Vilnius"),
			new TimezoneModel('Asia/Baghdad', "(GMT+03:00) Baghdad"),
			new TimezoneModel('Asia/Kuwait', "(GMT+03:00) Kuwait"),
			new TimezoneModel('Africa/Nairobi', "(GMT+03:00) Nairobi"),
			new TimezoneModel('Asia/Riyadh', "(GMT+03:00) Riyadh"),
			new TimezoneModel('Europe/Moscow', "(GMT+03:00) Moscow"),
			new TimezoneModel('Asia/Tehran', "(GMT+03:30) Tehran"),
			new TimezoneModel('Asia/Baku', "(GMT+04:00) Baku"),
			new TimezoneModel('Europe/Volgograd', "(GMT+04:00) Volgograd"),
			new TimezoneModel('Asia/Muscat', "(GMT+04:00) Muscat"),
			new TimezoneModel('Asia/Tbilisi', "(GMT+04:00) Tbilisi"),
			new TimezoneModel('Asia/Yerevan', "(GMT+04:00) Yerevan"),
			new TimezoneModel('Asia/Kabul', "(GMT+04:30) Kabul"),
			new TimezoneModel('Asia/Karachi', "(GMT+05:00) Karachi"),
			new TimezoneModel('Asia/Tashkent', "(GMT+05:00) Tashkent"),
			new TimezoneModel('Asia/Kolkata', "(GMT+05:30) Kolkata"),
			new TimezoneModel('Asia/Kathmandu', "(GMT+05:45) Kathmandu"),
			new TimezoneModel('Asia/Yekaterinburg', "(GMT+06:00) Ekaterinburg"),
			new TimezoneModel('Asia/Almaty', "(GMT+06:00) Almaty"),
			new TimezoneModel('Asia/Dhaka', "(GMT+06:00) Dhaka"),
			new TimezoneModel('Asia/Novosibirsk', "(GMT+07:00) Novosibirsk"),
			new TimezoneModel('Asia/Bangkok', "(GMT+07:00) Bangkok"),
			new TimezoneModel('Asia/Jakarta', "(GMT+07:00) Jakarta"),
			new TimezoneModel('Asia/Krasnoyarsk', "(GMT+08:00) Krasnoyarsk"),
			new TimezoneModel('Asia/Chongqing', "(GMT+08:00) Chongqing"),
			new TimezoneModel('Asia/Hong_Kong', "(GMT+08:00) Hong Kong"),
			new TimezoneModel('Asia/Kuala_Lumpur', "(GMT+08:00) Kuala Lumpur"),
			new TimezoneModel('Australia/Perth', "(GMT+08:00) Perth"),
			new TimezoneModel('Asia/Singapore', "(GMT+08:00) Singapore"),
			new TimezoneModel('Asia/Taipei', "(GMT+08:00) Taipei"),
			new TimezoneModel('Asia/Ulaanbaatar', "(GMT+08:00) Ulaan Bataar"),
			new TimezoneModel('Asia/Urumqi', "(GMT+08:00) Urumqi"),
			new TimezoneModel('Asia/Irkutsk', "(GMT+09:00) Irkutsk"),
			new TimezoneModel('Asia/Seoul', "(GMT+09:00) Seoul"),
			new TimezoneModel('Asia/Tokyo', "(GMT+09:00) Tokyo"),
			new TimezoneModel('Australia/Adelaide', "(GMT+09:30) Adelaide"),
			new TimezoneModel('Australia/Darwin', "(GMT+09:30) Darwin"),
			new TimezoneModel('Asia/Yakutsk', "(GMT+10:00) Yakutsk"),
			new TimezoneModel('Australia/Brisbane', "(GMT+10:00) Brisbane"),
			new TimezoneModel('Australia/Canberra', "(GMT+10:00) Canberra"),
			new TimezoneModel('Pacific/Guam', "(GMT+10:00) Guam"),
			new TimezoneModel('Australia/Hobart', "(GMT+10:00) Hobart"),
			new TimezoneModel('Australia/Melbourne', "(GMT+10:00) Melbourne"),
			new TimezoneModel('Pacific/Port_Moresby', "(GMT+10:00) Port Moresby"),
			new TimezoneModel('Australia/Sydney', "(GMT+10:00) Sydney"),
			new TimezoneModel('Asia/Vladivostok', "(GMT+11:00) Vladivostok"),
			new TimezoneModel('Asia/Magadan', "(GMT+12:00) Magadan"),
			new TimezoneModel('Pacific/Auckland', "(GMT+12:00) Auckland"),
			new TimezoneModel('Pacific/Fiji', "(GMT+12:00) Fiji")
		];
	}

	// Find timezone by id
	public findTimezone(id: string): TimezoneModel {
		let result: TimezoneModel = null;

		// Find
		ArrayUtility.find(this.timezones, id, (timezone: TimezoneModel) => {
			result = timezone;
		});
		return result;
	}

	public findTimezoneName(id: string): string {
		let result: string = '';

		// Find
		ArrayUtility.find(this.timezones, id, (timezone: TimezoneModel) => {
			result = timezone.display;
		});
		return result;
	}

	// Get all timezones
	public getAllTimezones(): TimezoneModel[] {
		return this.timezones;
	}

}