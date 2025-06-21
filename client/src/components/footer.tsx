// filepath: client/src/components/footer.tsx

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500 text-sm">
          © {new Date().getFullYear()}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-extrabold"> doc</span>
          <span className="text-primary font-extrabold">Flow</span> - Your Image Editor
        </div>
      </div>
    </footer>
  );
}
