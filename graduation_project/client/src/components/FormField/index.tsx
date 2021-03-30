import React from 'react';
// styles
import { FormControl, Input, InputLabel } from '@material-ui/core';
import './style.css';
// interafeces
import { FormFieldPropsInterface } from '../../interfaces';

export const FormField: React.FC<FormFieldPropsInterface> = (props) => {
    const {required, error, value, handler, label, type, className, id, onBlur} = props;

    return(
        <>
            <FormControl className={"form-field " + (className || '')} fullWidth={true} required={required} margin="normal" error={(required || value) ? !!error : false} >
                <InputLabel htmlFor={label}>{label}</InputLabel>
                <Input id={id} type={type} value={value} onChange={handler} onBlur={onBlur} />
                {(required || value) && <span className="helper-text">{error}</span>}
            </FormControl>
        </>
    )
}