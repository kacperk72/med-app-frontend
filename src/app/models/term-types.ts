export interface BookedTermElement {
    date: string;
    surname: string;
    name: string;
    godzina_wizyty: string;
    term_id: number;
    id_pacjenta: string;
    id_terminu: string;
}

export interface BookedTermElementFull extends BookedTermElement{
    id_lekarza: string;
    id_wizyty: string;
    reason_of_visit: string;
}

export interface TermDataElement {
    name: string;
    surname: string;
    speciality: string;
    data: string;
    hour: string;
}

export interface TermElement {
    city: string;
    date: string;
    godzina_wizyty: string;
    id: string;
    login: string;
    name: string;
    surname: string;
    reason: string;
    speciality: string;
    term_id: number;
}

export interface TermListVisitElement{
    speciality: string;
    city: string;
    id: string;
    data:string;
    godzina_wizyty: string;
    name: string;
    surname: string;
    term_id: number;
}

  


  