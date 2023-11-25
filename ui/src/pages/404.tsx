import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/router";

export default function NotFound() {
  return (
    <div className="bg-gray-50">
      <div className="bg-[url(http://res.cloudinary.com/dr15yjl8w/image/upload/v1700903715/public/bnbfhq50gw186716fo6a.png)] bg-[size:200px] h-screen w-full">
        <div className="h-screen grid place-content-center">
          <div className="text-center">
            <h1 className="text-[200px] font-black text-rose-500 leading-none">
              404
            </h1>
            <p className="text-4xl bg-gray-800/75 -rotate-3 text-white p-2">
              Back to{" "}
              <Link
                to="/clip"
                className={buttonVariants({
                  className: "text-4xl text-rose-300",
                  variant: "link",
                })}
              >
                Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
