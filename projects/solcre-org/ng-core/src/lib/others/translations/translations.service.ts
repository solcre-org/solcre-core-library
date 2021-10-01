import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class TranslationsService {
    //Default translations
	private translations: any = {
        dialog: {
            acceptBtn: 'Aceptar',
            cancelBtn: 'Cancelar',
        },
        simplePanel: {
            add: "Agregar",
			cancel: "Cancelar",
			save: "Guardar",
			modify: "Modificar",
			addNew: "Agregar nuevo",
            warningMessage: "No ha confirmado los cambios. ¿Desea continuar y perder los cambios?",
			deleteMessage: "¿Estás seguro que deseas borrar el ítem: ",
            placeholder: "Esta sección aún está vacía",

        },
        table: {
			modify: "Modificar",
			delete: "Eliminar",
			filter: "Filtrar en esta tabla"
		},
        pager: {
            next: "Siguiente",
            prev: "Previo",
        },
        inputHolder: {
            emptyWorkspace: "Debes seleccionar al menos un local.",
            requiredField: "Este campo es requerido.",
            invalidField: "Este campo es invalido.",
            minLengthField: "Este campo debe tener un largo mínimo de ",
            maxLengthField: "Este campo debe tener un largo máximo de ",
            passwordConfirmationNotEquals: "La contraseña y la confirmación no son iguales.",
            genericError: "Ocurrió un error en la solicitud.",
            password: "El usuario o la contraseña no son correctos.",
            requiredApi: "No se enviaron los siguientes campos requeridos: ",
            toLoongApi: "Los siguientes campos enviados son muy largos: ",
        },
        placeholder: {
            textEdit: "Esta sección aún está vacía",
            textNoEdit: "Esta sección está vacía",
            add: "Agregar ítem"
        }
    };

    public set(key:string, translations: any) {
        this.translations[key] = {...this.translations[key], ...translations}
    }

    public get(key: string, subKey?: string): any {
        const translation = subKey? this.translations[key][subKey] : this.translations[key];
        return translation ?? {};
    }

    public getAll(): any {
        return this.translations;
    }
}