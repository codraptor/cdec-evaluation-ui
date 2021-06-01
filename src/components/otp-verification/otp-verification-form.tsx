import { Button } from '@material-ui/core';
import * as React from 'react';
import { Formik, Form, Field } from 'formik';
import { MyField } from '../login/myfield';
import { useHistory } from 'react-router-dom';


interface Values {
    password: string;
};

interface Props {
    onSubmit: (values: Values) => void;
};

export const OTPVerificationForm: React.FC<Props> = ({onSubmit}) => {

    const history = useHistory();

    return (
        <Formik initialValues={{password:''}} onSubmit={(values) => {
            onSubmit(values)
        }}>
            {({values}) => (
                    <Form>
                        <div>
                        <Field name="password" label="Password" placeholder="Password" component={MyField}/>
                        </div>
                        <br/><br/>
                        <Button style={{ color: "#fff", paddingLeft: 40, paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
          background : "#000" , fontSize: 20 }}  type="submit" >Submit</Button>
                        <Button style={{ color: "#000", paddingLeft: 40, paddingRight: 40,  paddingTop: 10, paddingBottom: 10,
          background : "#fff" , fontSize: 20 }}  type="button" onClick={(() => {
              history.push("/");
          })}>Go Back</Button>
                    </Form>
                    
                )
            }
        </Formik>
    );
};