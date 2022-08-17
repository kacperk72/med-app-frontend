export interface PacientTermElement {
    data: string;
    godzina_wizyty: string;
    name: string;
    speciality: string;
    surname: string;
}

export interface PacientBookTermElement {
    city: string;
    data: string;
    godzina_wizyty: string;
    id: string;
    id_terminu: string;
    name: string;
    speciality: string;
    surname: string;
    term_id: number;
    reason: string;
    login: string;
}

export interface User{
    user_id: string;
    name: string;
    surname: string;
  }

export interface RegisterUser {
    id: string;
    name: string;
    surname: string;
    login: string;
    password: string;
    role: string;
}
