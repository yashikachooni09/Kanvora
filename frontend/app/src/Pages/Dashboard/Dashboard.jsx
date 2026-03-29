import Button from "../../Components/common/Button";

const Dashboard = () => {
  const boards = ["Project 1", "Project 2", "Project 3"];

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>

      <Button>Create Board</Button>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {boards.map((board, i) => (
          <div
            key={i}
            className="bg-gray-800 p-4 rounded shadow hover:bg-gray-700"
          >
            {board}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;