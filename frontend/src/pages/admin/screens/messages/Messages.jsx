import { useNavigate } from "react-router-dom";
import {
  getAllMessages,
  deleteMessage,
} from "../../../../services/index/messages";
import DataTable from "../../components/DataTable";
import { useDataTable } from "../../../../hooks/useDataTable";

const Messages = () => {
  const {
    searchKeyword,
    currentPage,
    isLoading,
    isFetching,
    data,
    searchKeywordHandler,
    submitSearchKeywordHandler,
    setCurrentPage,
    refetchData,
  } = useDataTable({
    dataQueryFn: () => getAllMessages(searchKeyword, currentPage),
    dataQueryKey: "messages",
    mutateDeleteFn: null,
    deleteDataMessage: null,
  });

  const navigate = useNavigate();

  if (!data) {
    return <div>Loading...</div>;
  }

  const messages = data.data || [];

  const handleDeleteMessage = async (id) => {
    if (window.confirm("Do you want to delete this message?")) {
      try {
        await deleteMessage(id);
        await refetchData();
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  return (
    <DataTable
      pageTitle="Messages"
      dataListName="All Messages"
      searchKeywordOnSubmitHandler={submitSearchKeywordHandler}
      searchInputPlaceHolder="Search email..."
      searchKeywordOnChangeHandler={searchKeywordHandler}
      searchKeyword={searchKeyword}
      tableHeaderTitleList={["Email", "Subject", "Message", "Date", ""]}
      isLoading={isLoading}
      isFetching={isFetching}
      data={messages}
      setCurrentPage={setCurrentPage}
      currentPage={currentPage}
      headers={null}
    >
      {messages.map((message) => (
        <tr key={message._id}>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {message.email}
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {message.subject}
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            {message.message}
          </td>
          <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
            <p className="text-gray-900 whitespace-no-wrap">
              {new Date(message.createdAt).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </td>
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm space-x-5">
            <button
              type="button"
              onClick={() => handleDeleteMessage(message._id)}
              className="text-red-600 hover:text-green-900"
            >
              Delete
            </button>
            <button
              onClick={() =>
                navigate(`/admin/messages/manage/view/${message._id}`)
              }
              className="text-green-600 hover:text-green-900"
            >
              View
            </button>
          </td>
        </tr>
      ))}
    </DataTable>
  );
};

export default Messages;
