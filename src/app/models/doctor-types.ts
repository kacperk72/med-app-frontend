export interface Doctor {
    name: string;
    surname: string;
    speciality: string;
    city: string;
}

export interface PeriodicElement {
    id_lekarza: string;
    name: string;
    surname: string;
    speciality: string[];
    city: string;
    icons: string;
}

export interface EditDoctorElement {
    user_id: string;
    name: string;
    surname: string;
    speciality: string[];
    city: string;
    login: string;
}

export interface ScheduleDataElement {
    name: string;
    surname: string;
    speciality: string[];
    id_lekarza: string;
    id_terminu: string;
    city: string;
    data: string;
    shortData: string;
    od_godziny: string;
    do_godziny: string;
    visits: string[];
}

export interface ScheduleDataTermElement {
    name: string;
    surname: string;
    id_terminu: string;
    city: string;
    data: string;
    reason: string;
    godzina: string;
    speciality: string;
}

export interface TermListElement {
    data: string;
    od_godziny: string;
}

export interface VisitElement {
    id_terminu: string;
    id_lekarza: string;
    data: string;
    godzina: string;
}

export interface DoctorDataElement {
    id_lekarza: string;
    speciality: string[];
    city: string;
    login: string;
    password: string;
    name: string;
    surname: string;
    role: string;
}

export interface SearchForm {
    role: string;
    city: string;
    dateFrom: string;
    // dateTo: string;
    timeFrom: string;
}
