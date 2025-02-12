import React from "react";
import { useParams } from "react-router-dom";
import PatientDemographicsComponent from "../../components/patient-demographics/PatientDemographicsComponent";

const PatientDemographicsPage = () => {
  const { id } = useParams();

  return <PatientDemographicsComponent id={id} />;
};

export default PatientDemographicsPage;
