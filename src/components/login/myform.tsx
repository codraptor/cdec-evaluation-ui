import { Button } from '@material-ui/core';
import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import { MyField } from './myfield';

interface Values {
    phone: string;
};

interface Props {
    onSubmit: (values: Values) => void;
};

export const MyForm: React.FC<Props> = ({onSubmit}) => {
    return (
        <Formik initialValues={{phone:''}} onSubmit={(values) => {
            onSubmit(values)
        }}>
            {({values}) => (
                    <Form>
                        <div>
                        <Field name="phone" label="Phone" placeholder="Phone" component={MyField}/>
                        </div>
                        <br/>
                        <Button style={{ color: "#fff", paddingLeft: 40, paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
          background : "#000" , fontSize: 20 }} type="submit" >Submit</Button>
                    </Form>
                    
                )
            }
        </Formik>
    );
};