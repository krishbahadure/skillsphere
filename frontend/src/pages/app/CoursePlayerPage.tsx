// export default function CoursePlayerPage() {
//   return (
//     <div className="p-10 text-4xl font-bold">
//       Course Player Working 🎉
//     </div>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { courseVideos } from "../../data/courseVideos";


export default function CoursePlayerPage() {
  const { id } = useParams();

  const course = courseVideos.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold">Course not found</h1>
      </div>
    );
  }

  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-2">
          {course.title}
        </h1>

        <p className="text-gray-600 mb-6">
          Instructor: <span className="font-semibold">{course.instructor}</span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Video */}
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-black">
              <iframe
                src={course.video}
                title={course.title}
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow mt-6">

              <h2 className="text-2xl font-bold mb-4">
                About this course
              </h2>

              <p className="text-gray-700 leading-7">
                {course.description}
              </p>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  Skills you'll learn
                </h3>

                <div className="flex flex-wrap gap-3">
                  {course.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-full bg-lime-100 text-lime-800 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="bg-white rounded-2xl shadow p-6 sticky top-6">

              <img
                src={course.thumbnail}
                alt={course.title}
                className="rounded-xl mb-5"
              />

              <h2 className="text-xl font-bold">
                {course.title}
              </h2>

              <p className="text-gray-500 mt-2">
                {course.category}
              </p>

              <div className="mt-6 space-y-3">

                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-semibold">
                    {course.duration}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Rating</span>
                  <span className="font-semibold">
                    ⭐ {course.rating}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Credits</span>
                  <span className="font-semibold">
                    {course.creditCost}
                  </span>
                </div>

              </div>

              <button
                className="mt-8 w-full bg-lime-400 hover:bg-lime-500 transition rounded-xl py-3 font-bold"
              >
                Mark Lesson Complete
              </button>

            </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="space-y-4">

    <h2 className="text-2xl font-bold">
        Related Courses
    </h2>

    {courseVideos
        .filter(c => c.id !== course.id)
        .map(c => (

        <div
            key={c.id}
            onClick={() => navigate(`/app/course/${c.id}`)}
            className="bg-white rounded-2xl shadow hover:shadow-lg cursor-pointer overflow-hidden transition"
        >

            <img
                src={c.thumbnail}
                alt={c.title}
                className="w-full h-36 object-cover"
            />

            <div className="p-4">

                <h3 className="font-semibold text-lg">
                    {c.title}
                </h3>

                <p className="text-sm text-gray-500">
                    {c.category}
                </p>

                <div className="flex justify-between mt-3 text-sm">

                    <span>⭐ {c.rating}</span>

                    <span>{c.duration}</span>

                </div>

            </div>

        </div>

    ))}

</div>

            

          </div>

        </div>
      </div>
    </div>
  );
}