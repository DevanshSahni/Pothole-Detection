import React from "react";

function ProofOfWork() {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-300 flex flex-col gap-10 pb-20">
      <div className="text-4xl py-[80px] bold flex tracking-wide justify-center items-center">
        Proof of Work
      </div>
      <div className="mx-28 text-2xl text-gray-100 tracking-wider border border-gray-600 px-5 py-3 border rounded-xl">
        Following are some of the detections:
      </div>
      <div className="flex items-center mx-28 gap-40">
        <div className="w-1/3 h-auto border border-gray-300 rounded-xl">
          <img
            src={Image}
            alt=""
            className="border border-gray-300 rounded-xl"
          />
        </div>
        <div className="w-5/12 leading-loose">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet ullam
          rem quasi nemo, soluta ea consequatur accusamus itaque doloremque in,
          ab perferendis culpa eius minus fugit! Vitae cupiditate illum esse!
        </div>
      </div>
      <hr className="mx-28 border border-gray-700" />
      <div className="flex flex-row-reverse items-center mx-28 gap-40">
        <div className="w-1/3 h-auto border border-gray-300 rounded-xl">
          <img
            src={Image}
            alt=""
            className="border border-gray-300 rounded-xl"
          />
        </div>
        <div className="w-5/12 leading-loose">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet ullam
          rem quasi nemo, soluta ea consequatur accusamus itaque doloremque in,
          ab perferendis culpa eius minus fugit! Vitae cupiditate illum esse!
        </div>
      </div>
      <hr className="mx-28 border border-gray-700" />
      <div className="flex mx-28 items-center gap-40">
        <div className="w-1/3 h-auto border border-gray-300 rounded-xl">
          <img
            src={Image}
            alt=""
            className="border border-gray-300 rounded-xl"
          />
        </div>
        <div className="w-5/12 leading-loose">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet ullam
          rem quasi nemo, soluta ea consequatur accusamus itaque doloremque in,
          ab perferendis culpa eius minus fugit! Vitae cupiditate illum esse!
        </div>
      </div>
    </div>
  );
}

export default ProofOfWork;
