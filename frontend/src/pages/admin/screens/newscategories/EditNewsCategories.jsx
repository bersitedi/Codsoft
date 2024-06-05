import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getSingleCategory,
  updateCategory,
} from "../../../../services/index/postCategories";
import { FiArrowLeft } from "react-icons/fi";
import {
  getSingleNewsCategory,
  updateNewsCategory,
} from "../../../../services/index/newsCategories";

const EditNewsCategories = () => {
  const queryClient = useQueryClient();
  const [categoryTitle, setCategoryTitle] = useState("");
  const navigate = useNavigate();
  const { slug } = useParams();
  const userState = useSelector((state) => state.user);

  const { isLoading, isError } = useQuery({
    queryFn: () => getSingleNewsCategory({ slug }),
    queryKey: ["categories", slug],
    onSuccess: (data) => {
      setCategoryTitle(data?.title);
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: mutateUpdateCategory, isLoading: isLoadingUpdateCategory } =
    useMutation({
      mutationFn: ({ title, slug, token }) => {
        return updateNewsCategory({
          title,
          slug,
          token,
        });
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries(["categories", slug]);
        toast.success("Category is updated");
        navigate(`/admin/mediacategories/manage/edit/${data._id}`, {
          replace: true,
        });
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const handleUpdateCategory = () => {
    if (!categoryTitle) return;
    mutateUpdateCategory({
      title: categoryTitle,
      slug,
      token: userState.userInfo.token,
    });
  };

  return (
    <>
      <div className="flex items-center ">
        <Link
          to="/admin/mediacategories/manage"
          className="text-gray-600 hover:text-gray-900 p-1 rounded-full text-2xl border border-green-400 "
        >
          <FiArrowLeft className="mr-2 text-green-500 pl-1" />
        </Link>
      </div>
      <div className="col-span-4 py-8">
        <h4 className="text-lg leading-tight">Update Category</h4>
        <div className="d-form-control w-full mt-6">
          <input
            value={categoryTitle}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setCategoryTitle(e.target.value)}
            placeholder="category title"
          />
          <button
            disabled={isLoadingUpdateCategory || isLoading || isError}
            type="button"
            onClick={handleUpdateCategory}
            className="w-fit mt-3 bg-green text-white font-semibold rounded-lg px-4 py-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Update Category
          </button>
        </div>
      </div>
    </>
  );
};

export default EditNewsCategories;
