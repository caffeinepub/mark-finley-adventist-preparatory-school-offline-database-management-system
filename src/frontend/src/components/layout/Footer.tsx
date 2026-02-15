export function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'mfaps-dbms');

  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Mark Finley Adventist Preparatory School</h3>
            <p className="text-muted-foreground">Atimatim Chairman</p>
            <p className="text-muted-foreground">P. O. Box 6486</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <p className="text-muted-foreground">Email: markfinleyaps@gmail.com</p>
            <p className="text-muted-foreground">Tel: 0244094882</p>
            <p className="text-muted-foreground">Headmaster: Mr. David Kwaku Marfo</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground">
              © {currentYear} Mark Finley APS
            </p>
            <p className="text-muted-foreground mt-2">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
