import List from "../../Components/common/List"

const BoardPage = () => {
  const lists = ["To Do", "In Progress", "Done"];

  return (
    <div className="flex gap-4 overflow-x-auto">
      {lists.map((list, i) => (
        <List key={i} title={list} />
      ))}
    </div>
  );
};

export default BoardPage;