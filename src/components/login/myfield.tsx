import * as React from 'react';
import { FieldProps } from 'formik';  
import { TextField } from '@material-ui/core';

interface Props extends FieldProps {
    label : string;
    placeholder: string;
}

export const MyField: React.FC<Props> = ({placeholder, label, field }) => {

    return (<TextField 
        inputProps={{style: {fontSize: 30, textAlign: "center"}}}
        InputLabelProps={{style: {fontSize: 20}}}
        placeholder={placeholder}
        label={label}
        {... field} />);

}