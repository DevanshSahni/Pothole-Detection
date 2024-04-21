import { useEffect, useState } from "react";

const PotholeData = () => {
  const [potholes, setPotholes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/getPredictionData`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setPotholes(data.potholes);
        console.log(data.potholes);
      } catch (err) {
        console.error("Error", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen w-screen flex items-center flex-col">
      <h1 className="m-10 text-5xl font-bold">Pothole Data</h1>
      <div className="w-[70%] pb-10">
        {potholes ? (
          <table className="table table-zebra">
            <thead>
              <tr className="text-center text-xl bg-base-200 border-2 border-[#dfdfdf6a]">
                <th>S. No.</th>
                <th>
                  Number of Potholes
                </th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {potholes.map((pothole, index) => (
                <tr className="text-center" key={index}>
                  <th>{index + 1}</th>
                  <td>{pothole.numberOfPotholes}</td>
                  <td>{pothole.latitude}</td>
                  <td>{pothole.longitude}</td>
                  <td>{pothole.timestamp.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-xl font-semibold m-10">No data to show</p>
        )}
      </div>
    </div>
  );
};

export default PotholeData;
