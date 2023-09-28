exports.protected = (req, res) => {
    res.json({ message: 'Protected resource', user: req.user });
};
  