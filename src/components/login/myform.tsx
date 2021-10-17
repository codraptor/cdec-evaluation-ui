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
                        <div style={{ marginTop :10 }} >
                        <Field name="phone" label="Phone" placeholder="Phone" component={MyField}/>
                        </div>
                        <br/>
                        <Button style={{ color: "#fff", paddingLeft: 40, paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
          background : "#173D7A" , fontSize: 15, boxShadow: "0px 0px 6px #9E9E9E"  }} type="submit" >Submit</Button>
                    </Form>
                    
                )
            }
        </Formik>
    );
};