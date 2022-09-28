export interface Doctor {
    name: string;
    surname: string;
    speciality: string;
    city: string;
}
export interface DoctorSCH extends Doctor {
    user_id: string;
    grafik: [];
    visits: [{ data: string; godzina: string; id_terminu: string }];
}
export interface DoctorTERM extends Doctor {
    login: string;
    reason: string;
    id_terminu: string;
    data: string;
    godzina: string;
}
export interface ScheduleDataTermElement extends Doctor {
    id_terminu: string;
    data: string;
    reason: string;
    godzina: string;
}
////////////////////////////////////////
export interface DoctorWithSpecArr {
    name: string;
    surname: string;
    speciality: string[];
    city: string;
}

export interface PeriodicElement extends DoctorWithSpecArr {
    id_lekarza: string;
    icons: string;
}

export interface EditDoctorElement extends DoctorWithSpecArr {
    user_id: string;
    login: string;
}

export interface ScheduleDataElement extends DoctorWithSpecArr {
    id_lekarza: string;
    id_terminu: string;
    data: string;
    shortData: string;
    od_godziny: string;
    do_godziny: string;
    visits: string[];
}
export interface DoctorDataElement extends DoctorWithSpecArr {
    id_lekarza: string;
    login: string;
    password: string;
    role: string;
}
//////////////////////////////////////////
export interface TermListElement {
    data: string;
    od_godziny: string;
}

export interface SearchForm {
    role: string;
    city: string;
    dateFrom: string;
    timeFrom: string;
}
