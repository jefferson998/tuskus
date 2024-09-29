function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-primary-dark">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="text-center text-6xl text-light font-bold tracking-wide">
          Tusks
        </h1>

        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Register an TaskAccount
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="#" method="POST" className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-white/80"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md  rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between ">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white/80"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md  rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white/80"
              >
                Confirm Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full h-full p-3 selection:text-white/95 text-white/95 focus:border-white/75 bg-primary-dark/90 placeholder:text-white/80 focus-visible:text-white/95 placeholder:text-md  rounded-[5px] border-white/70 border-2 focus:outline-none decoration-transparent shadow-md"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-primary-light/90 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-light/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-white/80">
          Alredy a member?{" "}
          <a
            href="/sign-in"
            className="font-semibold leading-6 text-primary-light/95 hover:text-primary-light"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
