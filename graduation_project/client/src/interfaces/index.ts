import React from 'react';

export interface SignUpFormInterface {
    email: string,
    password: string,
    repeatedPassword: string,
    name: string,
    surname: string,
    phone: string,
    errors?: {
        email?: string,
        password?: string,
        name?: string,
        surname?: string,
        phone?: string,
    }
}

export interface LogInFormInteface {
    email: string,
    password: string,
    errors?: {
        email?: string,
        password?: string,
    }
}

export interface FormFieldPropsInterface {
    required: boolean,
    className?: string,
    error?: string,
    value: string,
    label: string,
    handler: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
    type: string,
    id: string,
    onBlur?: React.FocusEventHandler<HTMLInputElement>
}

export interface SelectorPropsInterface {
    start: string,
    end: string,
    changeWeek: (change: number) => void,
}

export interface TaskInterface {
    _id: string,
    text: string,
    day: string,
    time: {
        start: string,
        end: string,
    },
    backgroundColor?: string,
}

export interface StateInterface {
    currentUserKey: string,
    tasks: TaskInterface[],
    startDay: string,
    endDay: string,
    error: string | null,
    focusedTime: string,
}

export interface UserInterface {
    name: string,
    surname: string,
    email: string,
    password: string,
    phone?: string,
}

export interface TaskStylesInterface {
    backgroundColor: string,
    position: string,
    zIndex: number,
    width: string,
    height: string,
}