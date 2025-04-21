import { usePosts } from "../../store";
import MetaArgs from "../../components/MetaArgs";
import Container from "../../components/Container";
import Skeleton from "../../components/Skeleton";
import { lazy, Suspense } from "react";
const Card = lazy(() => import("./components/Card"));

export default function home() {
  const { posts, error, loading } = usePosts();

  return (
    <>
      <MetaArgs title="Your Instashots feed" content="discover posts" />
      <Container classname="container">
        <div className="grid grid-cols-12 gap-4 justify-between">
          {/* post card div */}
          <div className="col-span-12 lg:col-span-6">
            <div className="w-full md:max-w-[450px] mx-auto">
              {loading ? (
                <Skeleton />
              ) : (
                <>
                  {posts?.length === 0 ? (
                    <p className="my-0 text-center text-lg">
                      No posts to display
                    </p>
                  ) : (
                    <Suspense fallback={<Skeleton />}>
                      {posts?.map((post) => (
                        <Card key={post._id} post={post} />
                      ))}
                    </Suspense>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
