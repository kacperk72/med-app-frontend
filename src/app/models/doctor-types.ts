export interface Doctor{
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

export interface ScheduleDataElement{
    id_lekarza: string;
    id_terminu: string;
    data: string;
    od_godziny: string;
    do_godziny: string;
}

export interface TermListElement{
    data:string;
    od_godziny: string;
}

export interface VisitElement{
    data: string;
    godzina_wizyty: string;
    id: string;
    id_terminu: string;
    term_id: number;
}

export interface DoctorDataElement {
    id_lekarza: string;
    speciality: string;
    city: string;
    login: string;
    password: string;
    name: string;
    surname: string;
    role: string;
  }
  