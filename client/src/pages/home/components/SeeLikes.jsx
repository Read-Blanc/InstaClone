import { useState } from "react";
import Modal from "../../../components/Modal";

export default function SeeLikes({ likeCount, post, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [active, setActive] = useState(0);

  return (
    <>
      <p
        className="mt-2 font-semibold cursor-pointer hover:text-gray-400 px-4 md:px-0"
        title="See who liked the post"
        onClick={() => setIsModalOpen(true)}
      >
        {likeCount} likes
      </p>
      <Modal
        isOpen={isModalOpen}
        id="likesPost"
        title="likes"
        classname="w-[90%] h-[400px] mx-auto py-3 px-0"
        onClose={() => setIsModalOpen(false)}
      >
        {post?.likes?.length === 0 && (
          <p className="text-center my-0">
            No likes yet! Be the first one to like. 😂
          </p>
        )}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
        >
          x
        </button>
      </Modal>
    </>
  );
}
