import { useParams } from "react-router-dom";

const BoardDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Board Details Page
      </h1>

      <p className="mt-4 text-gray-600">
        Board ID: {id}
      </p>
    </div>
  );
};

export default BoardDetails;