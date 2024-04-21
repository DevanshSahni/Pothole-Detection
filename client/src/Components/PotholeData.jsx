import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
        setPotholes(data.potholes.reverse());
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
      <div className="w-[80%] pb-10">
        {potholes ? (
          <table className="table table-zebra">
            <thead>
              <tr className="text-center text-xl bg-base-200 border-2 border-[#dfdfdf6a]">
                <th>S. No.</th>
                <th>Potholes</th>
                <th>Address</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Time</th>
                <th>Google Maps</th>
              </tr>
            </thead>
            <tbody>
              {potholes.map((pothole, index) => (
                <tr className="text-center" key={index}>
                  <th>{index + 1}</th>
                  <td>{pothole.numberOfPotholes}</td>
                  <td className="w-56">
                    {pothole.address || "Address Not Available!"}
                  </td>
                  <td>{pothole.latitude}</td>
                  <td>{pothole.longitude}</td>
                  <td>{pothole.timestamp.split("T")[0]}</td>
                  <td className="text-center">
                    <Link
                      to={`https://maps.google.com/?q=${pothole.latitude},${pothole.longitude}`}
                      target="_blank"
                      className="textFormat mx-auto"
                    >{`https://maps.google.com/?q=${pothole.latitude},${pothole.longitude}`}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-xl font-semibold m-10">
            No data to show
          </p>
        )}
      </div>
    </div>
  );
};

export default PotholeData;
